import "reflect-metadata";

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockRequirementsRepository } from '@/projects/requirements/infrastructure/persistence/mysql/requirements.repository.mock';
import { db } from '@/projects/shared/drizzle';

describe('RequirementsMySqlRepository', () => {
  let repository: MockRequirementsRepository;

  // Mock de las funciones del db
  const mockSelect = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockTransaction = vi.fn();

  beforeEach(() => {
    repository = new MockRequirementsRepository();

    // Restablecer los mocks antes de cada prueba
    mockSelect.mockReset();
    mockInsert.mockReset();
    mockUpdate.mockReset();
    mockTransaction.mockReset();

    // Simular el comportamiento de `db`
    db.select = mockSelect;
    db.insert = mockInsert;
    db.update = mockUpdate;
    db.transaction = mockTransaction;
  });

  it('should return requirements list', async () => {
    // Configura el mock para devolver los datos que esperas
    mockSelect.mockResolvedValueOnce([
      {
        id: '1',
        description: 'Requirement 1',
        priority: 'HIGHT',
        status: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        details: [
          {
            id: '1',
            description: 'Detail 1',
            quantity: '1',
            requirement_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]
      }
    ]);

    const result = await repository.getRequirements({ page: 1, sizePage: 10 }, { search: '' });

    // Asegúrate de que los datos devueltos coincidan con los esperados
    expect(result.requirements.length).toBe(1);
  });
});