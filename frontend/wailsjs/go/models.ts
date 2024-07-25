export namespace main {
	
	export class FileServerInfo {
	    path: string;
	    host: string;
	
	    static createFrom(source: any = {}) {
	        return new FileServerInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.host = source["host"];
	    }
	}

}

