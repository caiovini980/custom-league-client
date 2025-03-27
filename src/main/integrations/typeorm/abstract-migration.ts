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
    await queryRunner.startTransaction();
    const querySql = sqlScript
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);

    for (const q of querySql) {
      try {
        await queryRunner.query(q);
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw e;
      }
    }
    await queryRunner.commitTransaction();
  }
}
