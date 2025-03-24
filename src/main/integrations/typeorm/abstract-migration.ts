import { MigrationInterface, QueryRunner } from 'typeorm'

export class AbstractMigration implements MigrationInterface {
  private readonly filename: string

  constructor(clazz: new () => void) {
    const className = clazz.name
    const timestamp = className.replace(/\D/g, '')
    const migrationClassName = className.replace(/\d/g, '')
    const migrationName = migrationClassName
      .split(/(?=[A-Z])/)
      .map(this.toLoweCase)
      .join('-')
    this.filename = `${timestamp}-${migrationName}`
  }

  async up(queryRunner: QueryRunner): Promise<any> {
    await this.runSql(queryRunner, this.filename)
  }

  async down(_queryRunner: QueryRunner): Promise<any> {
    //await runSql(queryRunner, `${this.filename}-down.sql`)
  }

  private toLoweCase(value: string) {
    return value.toLowerCase()
  }

  private async runSql(queryRunner: QueryRunner, sqlname: string) {
    const i = await import(`./migrations/sql/${sqlname}.sql`)
    const sqlScript = i.default as string

    sqlScript
      .split(';')
      .filter(Boolean)
      .forEach((s) => queryRunner.query(s))
  }
}
