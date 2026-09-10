import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorAggregate } from '../domain/doctor.aggregate';
import { DoctorRepository } from './ports/doctor.repository';
import { CreateDoctorRequest } from '../presentation/dto/create-doctor.request';
import { UpdateDoctorRequest } from '../presentation/dto/update-doctor.request';
import { ListDoctorsRequest } from '../presentation/dto/list-doctors.request';
import { DoctorReadModel } from './dto/doctor-read-model';
import { PageResult } from '../../../shared-kernel/application/page-result';
import { DoctorStatus } from '../domain/doctor-status.enum';

@Injectable()
export class DoctorService {
  constructor(private readonly repository: DoctorRepository) {}

  async create(req: CreateDoctorRequest): Promise<DoctorReadModel> {
    if (await this.repository.findByEmployeeCode(req.employeeCode)) {
      throw new ConflictException('Employee code already exists');
    }
    const doctor = DoctorAggregate.create({
      userId: req.userId ?? null,
      employeeCode: req.employeeCode,
      firstName: req.firstName,
      lastName: req.lastName,
      displayName: req.displayName ?? `${req.firstName} ${req.lastName}`,
      gender: req.gender,
      dateOfBirth: req.dateOfBirth ? new Date(req.dateOfBirth) : null,
      phone: req.phone ?? null,
      email: req.email ?? null,
      bio: req.bio ?? null,
      yearsExperience: req.yearsExperience ?? 0,
    });
    await this.repository.save(doctor);
    return this.toReadModel(doctor);
  }

  async get(id: string): Promise<DoctorReadModel> {
    const doctor = await this.mustFind(id);
    return this.toReadModel(doctor);
  }

  async list(req: ListDoctorsRequest): Promise<PageResult<DoctorReadModel>> {
    const page = await this.repository.findMany({
      page: req.page ?? 1,
      limit: req.limit ?? 20,
      search: req.search,
      status: req.status,
      clinicId: req.clinicId,
      specialtyId: req.specialtyId,
    });
    return { ...page, items: page.items.map((x) => this.toReadModel(x)) };
  }

  async update(id: string, req: UpdateDoctorRequest): Promise<DoctorReadModel> {
    const doctor = await this.mustFind(id);
    doctor.updateProfile({
      ...(req.userId !== undefined && { userId: req.userId }),
      ...(req.firstName !== undefined && { firstName: req.firstName }),
      ...(req.lastName !== undefined && { lastName: req.lastName }),
      ...(req.displayName !== undefined && { displayName: req.displayName }),
      ...(req.gender !== undefined && { gender: req.gender }),
      ...(req.dateOfBirth !== undefined && {
        dateOfBirth: req.dateOfBirth ? new Date(req.dateOfBirth) : null,
      }),
      ...(req.phone !== undefined && { phone: req.phone }),
      ...(req.email !== undefined && { email: req.email }),
      ...(req.bio !== undefined && { bio: req.bio }),
      ...(req.yearsExperience !== undefined && {
        yearsExperience: req.yearsExperience,
      }),
    });
    await this.repository.save(doctor);
    return this.toReadModel(doctor);
  }

  async changeStatus(
    id: string,
    status: DoctorStatus,
  ): Promise<DoctorReadModel> {
    const doctor = await this.mustFind(id);
    doctor.changeStatus(status);
    await this.repository.save(doctor);
    return this.toReadModel(doctor);
  }

  async remove(id: string): Promise<void> {
    await this.mustFind(id);
    await this.repository.delete(id);
  }

  private async mustFind(id: string): Promise<DoctorAggregate> {
    const doctor = await this.repository.findById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  private toReadModel(doctor: DoctorAggregate): DoctorReadModel {
    const x = doctor.snapshot;
    return {
      ...x,
      dateOfBirth: x.dateOfBirth?.toISOString().slice(0, 10) ?? null,
      createdAt: x.createdAt.toISOString(),
      updatedAt: x.updatedAt.toISOString(),
    };
  }
}
