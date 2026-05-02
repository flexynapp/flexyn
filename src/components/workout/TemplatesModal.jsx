import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Trash2, Dumbbell, Save, FolderOpen, PenLine } from 'lucide-react';
import ExerciseAutocomplete from '@/components/regimens/ExerciseAutocomplete';
import { useProfanityGuard, hasAnyProfanity } from '@/lib/useProfanityGuard';
import ProfanityWarningDialog from '@/components/ProfanityWarningDialog';
import { useLanguage } from '@/lib/LanguageContext';

function NewTemplateForm({ onSave, onCancel }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const nameGuard = useProfanityGuard(setName);
  const [exercises, setExercises] = useState([]);
  const [exName, setExName] = useState('');
  const [exCanonical, setExCanonical] = useState('');
  const [exGroup, setExGroup] = useState('');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');

  const addExercise = () => {
    if (!exName.trim()) return;
    const displayName = exName.trim();
    const canonicalName = exCanonical || displayName;
    setExercises(prev => [...prev, {
      name: canonicalName,
      displayName,
      muscle_group: exGroup,
      target_sets: parseInt(exSets) || 3,
      target_reps: parseInt(exReps) || 10,
    }]);
    setExName('');
    setExCanonical('');
    setExGroup('');
    setExSets('3');
    setExReps('10');
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={t('workout.templates.namePlaceholder')}
        value={name}
        onChange={e => nameGuard.handleChange(e.target.value)}
      />

      <div className="space-y-2">
        {exercises.map((ex, i) => (
          <div key={i} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
            <Dumbbell className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm flex-1 font-medium">{ex.displayName || ex.name}</span>
            <span className="text-xs text-muted-foreground">{ex.target_sets}×{ex.target_reps}</span>
            <button onClick={() => setExercises(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="border border-dashed rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t('workout.templates.addExercise')}</p>
        <ExerciseAutocomplete
          value={exName}
          onChange={setExName}
          onSelect={(ex) => { setExName(ex.displayName || ex.name); setExCanonical(ex.name); setExGroup(ex.muscles[0] || ''); }}
          placeholder="Search exercise..."
        />
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">{t('workout.templates.sets')}</label>
            <Input type="number" min="1" value={exSets} onChange={e => setExSets(e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">{t('workout.templates.reps')}</label>
            <Input type="number" min="1" value={exReps} onChange={e => setExReps(e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="flex items-end">
            <Button size="sm" className="h-8" onClick={addExercise} disabled={!exName.trim()}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="outline" className="flex-1" onClick={onCancel}>{t('common.cancel')}</Button>
        <Button
          className="flex-1"
          disabled={!name.trim() || exercises.length === 0}
          onClick={() => {
            if (hasAnyProfanity(name)) {
              toast.error('Please remove inappropriate language before saving.');
              return;
            }
            onSave({ name: name.trim(), exercises });
          }}
        >
          <Save className="w-4 h-4 mr-1.5" />
          {t('workout.templates.saveBtn')}
        </Button>
      </div>
      <ProfanityWarningDialog open={nameGuard.open} onContinue={nameGuard.onContinue} />
    </div>
  );
}

// view: 'choice' | 'create' | 'load'
export default function TemplatesModal({ open, onClose, onLoadTemplate }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [view, setView] = useState('choice');

  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['workoutTemplates', user?.email],
    queryFn: () => base44.entities.WorkoutTemplate.filter({ created_by: user.email }, '-created_date'),
    enabled: !!user?.email && view === 'load',
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutTemplate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutTemplates', user?.email] });
      setView('choice');
      toast.success(t('workout.templates.saved'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WorkoutTemplate.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['workoutTemplates', user?.email] });
      const previous = queryClient.getQueryData(['workoutTemplates', user?.email]);
      queryClient.setQueryData(['workoutTemplates', user?.email], (old = []) => old.filter(t => t.id !== id));
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['workoutTemplates', user?.email], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['workoutTemplates', user?.email] }),
  });

  const handleClose = () => {
    setView('choice');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {view === 'choice' && t('workout.templates.title')}
            {view === 'create' && t('workout.templates.create')}
            {view === 'load' && t('workout.templates.load')}
          </DialogTitle>
        </DialogHeader>

        {view === 'choice' && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              onClick={() => setView('load')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{t('workout.templates.loadBtn')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('workout.templates.loadDesc')}</p>
              </div>
            </button>
            <button
              onClick={() => setView('create')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <PenLine className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-heading font-bold text-sm">{t('workout.templates.createBtn')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t('workout.templates.createDesc')}</p>
              </div>
            </button>
          </div>
        )}

        {view === 'create' && (
          <NewTemplateForm
            onSave={(data) => createMutation.mutate(data)}
            onCancel={() => setView('choice')}
          />
        )}

        {view === 'load' && (
          <div className="py-2 space-y-3">
            {templatesLoading ? (
              [1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)
            ) : templates.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
                <p className="font-heading font-semibold text-sm">{t('workout.templates.noTemplates')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('workout.templates.noTemplatesDesc')}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setView('create')}>
                  {t('workout.templates.createFirst')}
                </Button>
              </div>
            ) : (
              templates.map(template => (
                <Card key={template.id} className="p-4 border-none shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold">{template.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('workout.templates.exerciseCount').replace('{n}', template.exercises?.length || 0)}
                        {template.exercises?.length > 0 && (
                          <> · <span className="truncate">{template.exercises.slice(0, 3).map(e => e.displayName || e.name).join(', ')}{template.exercises.length > 3 ? '…' : ''}</span></>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button size="sm" onClick={() => { onLoadTemplate(template); handleClose(); }}>
                        {t('workout.templates.useThis')}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-3.5 h-3.5 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('workout.templates.deleteTitle')}</AlertDialogTitle>
                             <AlertDialogDescription>{t('workout.templates.deleteDesc').replace('{name}', template.name)}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                             <AlertDialogAction onClick={() => deleteMutation.mutate(template.id)}>{t('common.delete')}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}