import { randomUUID } from 'crypto';

export interface SpecialtyProps {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class SpecialtyAggregate {
  private constructor(private props: SpecialtyProps) {}
  static create(
    input: Pick<SpecialtyProps, 'code' | 'name' | 'description'>,
  ): SpecialtyAggregate {
    if (!input.code.trim() || !input.name.trim())
      throw new Error('Specialty code and name are required');
    const now = new Date();
    return new SpecialtyAggregate({
      ...input,
      id: randomUUID(),
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }
  static rehydrate(props: SpecialtyProps): SpecialtyAggregate {
    return new SpecialtyAggregate(props);
  }
  get snapshot(): Readonly<SpecialtyProps> {
    return this.props;
  }
  update(
    input: Partial<Pick<SpecialtyProps, 'name' | 'description' | 'active'>>,
  ): void {
    this.props = { ...this.props, ...input, updatedAt: new Date() };
  }
}
