import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, MapPin, Search, Check } from 'lucide-react';
import { COUNTRIES, US_STATES } from '@/lib/regions';
import { useLanguage } from '@/lib/LanguageContext';

export default function LocationStep({ onNext, initialCountry = '', initialState = '' }) {
  const { t } = useLanguage();
  const [countryCode, setCountryCode] = useState(initialCountry);
  const [stateCode, setStateCode] = useState(initialState);
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [countryOpen, setCountryOpen] = useState(!initialCountry);
  const [stateOpen, setStateOpen] = useState(!initialState);

  const countrySearchRef = useRef(null);
  const stateSearchRef = useRef(null);

  // Auto-focus the search field when a list opens
  useEffect(() => {
    if (countryOpen) setTimeout(() => countrySearchRef.current?.focus(), 80);
  }, [countryOpen]);
  useEffect(() => {
    if (stateOpen && countryCode === 'US') setTimeout(() => stateSearchRef.current?.focus(), 80);
  }, [stateOpen, countryCode]);

  const filteredCountries = countrySearch
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()))
    : COUNTRIES;

  const filteredStates = stateSearch
    ? US_STATES.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
    : US_STATES;

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
  const selectedState = US_STATES.find(s => s.code === stateCode);

  const isComplete = countryCode && (countryCode !== 'US' || stateCode);

  const handlePickCountry = (code) => {
    setCountryCode(code);
    setCountrySearch('');
    setCountryOpen(false);
    if (code !== 'US') {
      setStateCode('');
      setStateOpen(false);
    } else {
      setStateOpen(true); // open state picker automatically for US
    }
  };

  const handlePickState = (code) => {
    setStateCode(code);
    setStateSearch('');
    setStateOpen(false);
  };

  const clearCountry = () => {
    setCountryCode('');
    setStateCode('');
    setCountryOpen(true);
    setStateOpen(false);
  };

  const clearState = () => {
    setStateCode('');
    setStateOpen(true);
  };

  const handleNext = () => {
    if (!isComplete) return;
    onNext({ country_code: countryCode, state_code: countryCode === 'US' ? stateCode : null });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 bg-background flex flex-col items-center justify-start overflow-y-auto p-4 md:p-6"
    >
      {/* Decorative gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-96"
        style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 0%, hsl(var(--primary) / 0.08), transparent)',
        }}
      />

      <div className="relative w-full max-w-md py-6 md:py-8 pb-10">
        {/* Step pill */}
        <div className="flex justify-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {t('onboarding.location.stepLabel') || 'Step 2 of 2'}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 ring-1 ring-primary/20 shadow-sm">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-center mb-1">
            {t('onboarding.location.title')}
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            {t('onboarding.location.subtitle')}
          </p>
        </div>

        {/* Country picker */}
        <div className="mb-5">
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('onboarding.location.country')} <span className="text-destructive">*</span>
          </label>

          {/* Selected country pill (clickable to re-open) */}
          {selectedCountry && !countryOpen && (
            <button
              type="button"
              onClick={() => setCountryOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-primary bg-primary/5 mb-2 text-left hover:bg-primary/10 transition-colors"
            >
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="font-medium text-sm flex-1">{selectedCountry.name}</span>
              <Check className="w-4 h-4 text-primary" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearCountry(); }}
                className="text-xs text-muted-foreground hover:text-destructive ml-1 px-1"
                aria-label="Clear country"
              >
                ✕
              </button>
            </button>
          )}

          {/* Collapsible country list */}
          <AnimatePresence initial={false}>
            {countryOpen && (
              <motion.div
                key="country-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    ref={countrySearchRef}
                    placeholder={t('onboarding.location.searchCountry')}
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border bg-card">
                  {filteredCountries.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handlePickCountry(c.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors hover:bg-secondary ${
                        countryCode === c.code ? 'bg-primary/10 font-medium' : ''
                      }`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="flex-1">{c.name}</span>
                      {countryCode === c.code && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">{t('onboarding.location.noResults')}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* State picker — only for US */}
        <AnimatePresence initial={false}>
          {countryCode === 'US' && (
            <motion.div
              key="state-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden mb-5"
            >
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('onboarding.location.state')} <span className="text-destructive">*</span>
              </label>

              {/* Selected state pill (clickable to re-open) */}
              {selectedState && !stateOpen && (
                <button
                  type="button"
                  onClick={() => setStateOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-primary bg-primary/5 mb-2 text-left hover:bg-primary/10 transition-colors"
                >
                  <span className="font-bold text-primary text-sm w-8">{selectedState.code}</span>
                  <span className="font-medium text-sm flex-1">{selectedState.name}</span>
                  <Check className="w-4 h-4 text-primary" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); clearState(); }}
                    className="text-xs text-muted-foreground hover:text-destructive ml-1 px-1"
                    aria-label="Clear state"
                  >
                    ✕
                  </button>
                </button>
              )}

              {/* Collapsible state list */}
              <AnimatePresence initial={false}>
                {stateOpen && (
                  <motion.div
                    key="state-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        ref={stateSearchRef}
                        placeholder={t('onboarding.location.searchState')}
                        value={stateSearch}
                        onChange={e => setStateSearch(e.target.value)}
                        className="pl-9 h-10"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto rounded-xl border border-border divide-y divide-border bg-card">
                      {filteredStates.map(s => (
                        <button
                          key={s.code}
                          onClick={() => handlePickState(s.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors hover:bg-secondary ${
                            stateCode === s.code ? 'bg-primary/10 font-medium' : ''
                          }`}
                        >
                          <span className="font-bold text-xs text-muted-foreground w-8">{s.code}</span>
                          <span className="flex-1">{s.name}</span>
                          {stateCode === s.code && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      ))}
                      {filteredStates.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">{t('onboarding.location.noResults')}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="w-full h-12 font-heading font-bold text-base mt-2"
          onClick={handleNext}
          disabled={!isComplete}
        >
          {t('onboarding.demographics.getStarted')} <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}