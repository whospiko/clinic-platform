import { randomUUID } from 'crypto';

import { DentalChairStatus } from './dental-chair-status.enum';

export type CreateDentalChairProps = {
    id?: string;
    clinicId?: string | null;
    code: string;
    name: string;
    description?: string | null;
    status?: DentalChairStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

export type UpdateDentalChairProps = {
    code?: string;
    name?: string;
    description?: string | null;
};

export class DentalChairAggregate {
    private constructor(
        private readonly _id: string,
        private _clinicId: string | null,
        private _code: string,
        private _name: string,
        private _description: string | null,
        private _status: DentalChairStatus,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) { }

    static create(props: CreateDentalChairProps): DentalChairAggregate {
        const now = new Date();

        const chair = new DentalChairAggregate(
            props.id ?? randomUUID(),
            props.clinicId ?? null,
            props.code.trim(),
            props.name.trim(),
            props.description?.trim() || null,
            props.status ?? DentalChairStatus.ACTIVE,
            props.createdAt ?? now,
            props.updatedAt ?? now,
        );

        chair.validate();

        return chair;
    }

    static rehydrate(props: Required<Omit<CreateDentalChairProps, 'description'>> & {
        description: string | null;
    }): DentalChairAggregate {
        const chair = new DentalChairAggregate(
            props.id,
            props.clinicId ?? null,
            props.code,
            props.name,
            props.description,
            props.status,
            props.createdAt,
            props.updatedAt,
        );

        chair.validate();

        return chair;
    }

    update(props: UpdateDentalChairProps): void {
        if (props.code !== undefined) {
            this._code = props.code.trim();
        }

        if (props.name !== undefined) {
            this._name = props.name.trim();
        }

        if (props.description !== undefined) {
            this._description = props.description?.trim() || null;
        }

        this.touch();
        this.validate();
    }

    changeStatus(status: DentalChairStatus): void {
        this._status = status;
        this.touch();
        this.validate();
    }

    private touch(): void {
        this._updatedAt = new Date();
    }

    private validate(): void {
        if (!this._code || this._code.length < 2) {
            throw new Error('Dental chair code must be at least 2 characters.');
        }

        if (!this._name || this._name.length < 2) {
            throw new Error('Dental chair name must be at least 2 characters.');
        }

        if (!Object.values(DentalChairStatus).includes(this._status)) {
            throw new Error('Invalid dental chair status.');
        }
    }

    get id(): string {
        return this._id;
    }

    get clinicId(): string | null {
        return this._clinicId;
    }

    get code(): string {
        return this._code;
    }

    get name(): string {
        return this._name;
    }

    get description(): string | null {
        return this._description;
    }

    get status(): DentalChairStatus {
        return this._status;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}