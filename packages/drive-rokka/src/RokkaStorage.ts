import { ContentResponse, ExistsResponse, Response, StatResponse, Storage, UnknownException } from '@directus/drive';

export class RokkaStorage extends Storage {
	private rokka: any;
	private testHash = 'f6d0ebb63eeb6105eed12f92037b5b3bba8edbf9';

	constructor(private config: RokkaStorageConfig) {
		super();
		this.rokka = require('rokka')({
			apiKey: this.config.apikey,
		});
	}

	override async put(
		_location: string,
		_content: string | Buffer | NodeJS.ReadableStream,
		_type?: string | undefined
	): Promise<Response> {
		try {
			const result = await this.rokka.sourceimages.create(this.config.organisation, _location, _content);
			console.dir(result.body.items)
			return { raw: result };
		} catch (e: any) {
			throw new UnknownException(e, e.name, _location); //REPLACE ME
		}
	}

	override async getStat(_location: string): Promise<StatResponse> {
		try {
			const result = await this.rokka.sourceimages.get(
				this.config.organisation,
				this.testHash //REPLACE ME
			);
			return {
				size: result.body.size,
				modified: result.body.created as Date, // SEE if I can get the update
				raw: result,
			};
		} catch (e: any) {
			throw new UnknownException(e, e.name, _location);
		}
	}

	override async getBuffer(_location: string): Promise<ContentResponse<Buffer>> {
		try {
			const bufferResult = await this.rokka.sourceimages.downloadAsBuffer(this.config.organisation, this.testHash);

			return {
				content: bufferResult.body,
				raw: bufferResult,
			};
		} catch (e: any) {
			throw new UnknownException(e, e.name, _location);
		}
	}

	override async exists(_location: string): Promise<ExistsResponse> {
		try {
			const existsResult = await this.rokka.sourceimages.get(this.config.organisation, this.testHash);
			return { exists: true, raw: existsResult };
		} catch (e: any) {
			if (e.statusCode === 404) {
				return { exists: false, raw: e };
			} else {
				throw new UnknownException(e, e.name, _location);
			}
		}
	}

	override async getStream(_location: string): Promise<NodeJS.ReadableStream> {
		try {
			const result = await this.rokka.sourceimages.download(this.config.organisation, this.testHash);
			const reader = result.body.getReader();
			return reader;
		} catch (e: any) {
			throw new UnknownException(e, e.name, _location);
		}
	}
}

export interface RokkaStorageConfig {
	apikey: string;
	organisation: string;
}
