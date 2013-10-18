var grunt = require("grunt");

function JSMeterTask(task, options, sources, dest) {

    this.task = task; 
    this.options = options; 
    this.sources = sources;
    this.dest = dest;
};

JSMeterTask.prototype.run = function() {

    var meter, jsmeter = require("jsmeter"), writer, outputfile, dest,
        render = ( this.dest === 'console' ) ? require("./ConsoleRender") : require("./LogRender");;
    
    dest = this.dest;
    if ( ! this.sources ) { 
        console.log("No files to meter!");
        return;
    }
    meter = jsmeter['jsmeter'];
    
    writer = new render();
    this.sources.forEach(function(f) {
        var data, results; 
        
        data = grunt.file.read(f);
        results = meter.run(data);
	    if ( dest !== 'console' ) {
    	    outputfile = dest + "/" + f.substring(f.lastIndexOf("/") + 1) + ".log";
            writer.setFilename(outputfile);
    	}
    	console.log(dest);
        writer.writeResults(results); 
 
    });
    
};

JSMeterTask.Defaults = {
    dest: 'console'
};
 
// Some static task information
JSMeterTask.taskName = "jsmeter";
JSMeterTask.taskDescription = "Grunt plugin to run jsmeter to get metrics out of the code quality";

 
module.exports = JSMeterTask;