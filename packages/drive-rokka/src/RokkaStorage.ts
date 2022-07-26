import { Storage } from '@directus/drive';

export class RokkaStorage extends Storage {
	constructor(private config: RokkaStorageConfig) {
		super();
		this.config.apikey = `${this.config.apikey}`;
	}
}

export interface RokkaStorageConfig {
	apikey: string;
	organisation: string;
}
