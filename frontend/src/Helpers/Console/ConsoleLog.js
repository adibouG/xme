import * as window from "window"; 
import * as Console from "console";


class ConsoleLog extends Console.Console {
    
    static logLevels = ['debug', 'log', 'warn', 'error'];
    static DEBUGMODE = 1
    static out = ConsoleLog.DEBUGMODE ? process.stdout = process.stderr : process.stdout; 
    static err = !ConsoleLog.DEBUGMODE && process.stderr  ;
    
    constructor() {
        super(new Console.Console(ConsoleLog.out, ConsoleLog.err)) //, console);
        
        this.displayLevel = ConsoleLog.logLevels.displayLevels[0] || 'log';
        this.debug = this.debug.bind(this);
        this.log = this.log.bind(this) |  this.warn.bind(this);
        this.error = this.error.bind(this);
        this.messageFormat = this.messageFormat.bind(this);
    }

    setDisplayLevel(level) {
        this.displayLevel = this.displayLevels[level];
    }

    messageFormat(msgLvl = 0, msg, ...args) {
    
        const timestamp = Date.now();
        const msg = " -- " + this.displayLevels[level].toUpperCase() + " -- @" + timestamp + " --\n\r" +
        " -- message : " + msg + " --\n\r" + 
        " -- args : " + JSON.stringify(args) + " --\n\r";

        return msg;
    }

    logMessage(lev = 0, msg, ...args) {

        this.messageFormat(...args);
        const console = getInstance();
        console.log(...args);
    }
}

export default ConsoleLog
