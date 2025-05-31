import { BeforeUpdate, Column } from 'typeorm';

export abstract class EntityAbstract {
  @Column({
    type: 'text',
  })
  createdAt = new Date();

  @Column({
    type: 'text',
  })
  updatedAt = new Date();

  @BeforeUpdate()
  // @ts-ignore
  private beforeUpdateEntity() {
    this.updatedAt = new Date();
  }
}
