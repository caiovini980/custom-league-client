import { MigrationInterface, QueryRunner } from 'typeorm';

export class AbstractMigration implements MigrationInterface {
  private readonly folderName: string;

  constructor(clazz: new () => unknown) {
    const className = clazz.name;
    const timestamp = className.replace(/\D/g, '');
    const migrationClassName = className.replace(/\d/g, '');
    const migrationName = migrationClassName
      .split(/(?=[A-Z])/)
      .map(this.toLoweCase)
      .join('-');
    this.folderName = `${timestamp}-${migrationName}`;
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await this.runSql(queryRunner, this.folderName);
  }

  async down(_queryRunner: QueryRunner): Promise<void> {
    return;
  }

  private toLoweCase(value: string) {
    return value.toLowerCase();
  }

  private async runSql(queryRunner: QueryRunner, sqlname: string) {
    const i = await import(`./migrations/${sqlname}/migration.sql`);
    const sqlScript = i.default as string;
    sqlScript
      .trim()
      .split(';')
      .filter(Boolean)
      .forEach((s) => {
        queryRunner.query(s);
      });
  }
}
