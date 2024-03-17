export class CorsException extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'CorsException';
  }
}
