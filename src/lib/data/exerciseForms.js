// src/lib/data/exerciseForms.js
import { base44 } from '@/api/base44Client';

export const list = () =>
  base44.entities.ExerciseForm.list();

export const create = (data) => base44.entities.ExerciseForm.create(data);
export const update = (id, data) => base44.entities.ExerciseForm.update(id, data);
export const remove = (id) => base44.entities.ExerciseForm.delete(id);