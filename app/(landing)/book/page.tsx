"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Send,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { createBookingAction } from "@/app/actions/booking.action";
import { usePreloader } from "@/components/PreloaderContext";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PixelButton } from "@/components/ui/PixelButton";
import { TextReveal } from "@/components/ui/TextReveal";

const BUDGET_OPTIONS = [
  "< ₹50,000",
  "₹50,000 - ₹1,50,000",
  "₹1,50,000 - ₹3,00,000",
  "₹3,00,000+",
];
const TIMELINE_OPTIONS = [
  "< 1 Month",
  "1 - 2 Months",
  "2 - 4 Months",
  "4+ Months",
];
const TECH_SPECS = [
  "Page Design",
  "Full Stack Dev",
  "Custom Database",
  "API Integrations",
  "Auth Setup",
  "Custom Solution",
];

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required (clientName)"),
  email: z.string().email("Invalid email address format (clientEmail)"),
  company: z.string().optional(),
  budget: z
    .string()
    .min(1, "Estimated budget selection is required (estimatedBudget)"),
  customBudget: z.string().optional(),
  timeline: z
    .string()
    .min(1, "Target timeline selection is required (targetTimeline)"),
  customTimeline: z.string().optional(),
  specs: z
    .array(z.string())
    .min(1, "Select at least one engineering specification (specs)"),
  customMessage: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookConsole() {
  const { isCompleted } = usePreloader();
  const [step, setStep] = useState(1);

  // Form setup
  const {
    control,
    trigger,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      customBudget: "",
      timeline: "",
      customTimeline: "",
      specs: [],
      customMessage: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Watch form fields for live JSON preview
  const watchedName = watch("name");
  const watchedEmail = watch("email");
  const watchedCompany = watch("company");
  const watchedBudget = watch("budget");
  const watchedCustomBudget = watch("customBudget");
  const watchedTimeline = watch("timeline");
  const watchedCustomTimeline = watch("customTimeline");
  const watchedSpecs = watch("specs");
  const watchedCustomMessage = watch("customMessage");

  const handleToggleSpec = (spec: string) => {
    const currentSpecs = watchedSpecs || [];
    const alreadySelected = currentSpecs.includes(spec);
    const newSpecs = alreadySelected
      ? currentSpecs.filter((s) => s !== spec)
      : [...currentSpecs, spec];
    setValue("specs", newSpecs, { shouldValidate: true });
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["name", "email"]);
    } else if (step === 2) {
      isValid = await trigger(["budget", "timeline"]);
    } else if (step === 3) {
      isValid = await trigger("specs");
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setConsoleLogs([]);

    const compilerLogs = [
      "INIT // INITIALIZING BLUEPRINT COMPILE...",
      "VAL // VALIDATING COMPILER INPUTS: OK",
      "BUILD // INJECTING IDENTITY SCHEMATIC...",
      "BUILD // COMPILING PARAMETERS MATRIX...",
      "BUILD // CONFIGURING STACK SPECIFICATION...",
      "SMTP // ESTABLISHING SOCKET DISPATCH NODE...",
      "SEC // SEALING TRANSMISSION SHELL (SHA-256)...",
    ];

    for (let i = 0; i < compilerLogs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setConsoleLogs((prev) => [...prev, compilerLogs[i]]);
    }

    try {
      const response = await createBookingAction(data);

      if (response.success) {
        setConsoleLogs((prev) => [
          ...prev,
          "DONE // PIPELINE STABILIZED - BLUEPRINT DISPATCHED",
        ]);
        await new Promise((resolve) => setTimeout(resolve, 350));
        setIsSuccess(true);
        reset();
      } else {
        setConsoleLogs((prev) => [
          ...prev,
          `ERR // SMTP DISPATCH FAILED: ${response.error || "Unknown server error"}`,
        ]);
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Unknown error";
      setConsoleLogs((prev) => [
        ...prev,
        `ERR // DATABASE SYSTEM CRASH: ${errMessage}`,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert watched state to formatted JSON string
  const compileJSONString = () => {
    return JSON.stringify(
      {
        identity: {
          clientName: watchedName || null,
          clientEmail: watchedEmail || null,
          organization: watchedCompany || null,
        },
        parameters: {
          budgetLimit: watchedBudget || null,
          customPriceOffer: watchedCustomBudget || null,
          targetTimeline: watchedTimeline || null,
          customTimelineOffer: watchedCustomTimeline || null,
        },
        engineeringSpecs: watchedSpecs || [],
        customRequirements: watchedCustomMessage || null,
      },
      null,
      2,
    );
  };

  return (
    <main className="min-h-screen w-full pt-28 sm:pt-36 pb-20 px-4 sm:px-8 md:px-16 lg:px-24 select-none relative overflow-hidden">
      {/* Background decoration grid lines */}
      <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-[0.03] border-x border-foreground">
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
        <div className="border-r border-foreground h-full" />
      </div>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        viewport={{ once: false, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
        className="border-b border-border/30 pb-8 mb-12 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10"
      >
        <div className="space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block">
            {"// PROJECT_LAUNCH_PAD // BOOKING_CONSOLE"}
          </span>
          <h1 className="font-sans font-black text-5xl sm:text-7xl md:text-[8vw] uppercase tracking-tighter leading-none text-foreground">
            <TextReveal text="BOOKING" />
            <TextReveal text="CONSOLE" className="text-accent" />
          </h1>
        </div>
        <div className="font-mono text-xs text-muted-foreground md:text-right max-w-xs">
          Step-by-step project parameter builder. Filter project specifications,
          budgeting metrics, and tech stacks.
        </div>
      </motion.div>

      {/* 2-Column Split: Form Wizard & Live JSON Compiler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative z-10 w-full">
        {/* Left Column: Form Questionnaire Wizard (Subtle Glassmorphism) */}
        <div className="lg:col-span-7 relative flex flex-col">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-[6px] -z-10" />
          <div className="border-2 border-foreground bg-transparent backdrop-blur-[6px] shadow-[8px_8px_0px_var(--color-accent)] p-6 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden rounded-none min-h-[480px]">
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

            {/* Step Indicators */}
            {!isSuccess && (
              <div className="flex justify-between items-center border-b border-border/30 pb-4 mb-6 w-full font-mono text-[10px] text-muted-foreground">
                <span className="font-bold text-accent uppercase">
                  STEP 0{step} OF 04 {"//"} {step === 1 && "CLIENT_IDENTITY"}
                  {step === 2 && "SCOPE_PARAMETERS"}
                  {step === 3 && "TECH_STACK_SPECS"}
                  {step === 4 && "COMPILE_BLUEPRINT"}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((s) => (
                    <span
                      key={s}
                      className={`w-2 h-2 rounded-full border border-foreground ${
                        step >= s ? "bg-accent border-accent" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Active Step Content */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 w-full"
                    >
                      {/* Step 1: Identity */}
                      {step === 1 && (
                        <div className="space-y-4 font-mono">
                          <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                  [ clientName ] *
                                </FieldLabel>
                                <input
                                  {...field}
                                  id={field.name}
                                  type="text"
                                  aria-invalid={fieldState.invalid}
                                  placeholder="Identify yourself..."
                                  className="w-full bg-secondary/20 border border-border/30 focus:border-accent p-3 focus:outline-none text-accent font-bold"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                  [ clientEmail ] *
                                </FieldLabel>
                                <input
                                  {...field}
                                  id={field.name}
                                  type="email"
                                  aria-invalid={fieldState.invalid}
                                  placeholder="your-email@gateway.com"
                                  className="w-full bg-secondary/20 border border-border/30 focus:border-accent p-3 focus:outline-none text-accent font-bold"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="company"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                  [ organizationName ]
                                </FieldLabel>
                                <input
                                  {...field}
                                  id={field.name}
                                  type="text"
                                  aria-invalid={fieldState.invalid}
                                  placeholder="Optional metadata..."
                                  className="w-full bg-secondary/20 border border-border/30 focus:border-accent p-3 focus:outline-none text-accent font-bold"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      )}

                      {/* Step 2: Parameters */}
                      {step === 2 && (
                        <div className="space-y-6 font-mono">
                          <div className="space-y-3">
                            <span className="text-xs uppercase text-foreground font-bold block">
                              [ estimatedBudget ] *
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              {BUDGET_OPTIONS.map((opt) => (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() =>
                                    setValue("budget", opt, {
                                      shouldValidate: true,
                                    })
                                  }
                                  className={`border p-3 text-center transition-all font-bold cursor-crosshair ${
                                    watchedBudget === opt
                                      ? "bg-accent text-accent-foreground border-accent shadow-[2px_2px_0px_var(--color-primary)]"
                                      : "bg-secondary/10 border-border/30 hover:border-accent/50 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            {/* Custom Price message field */}
                            <Controller
                              name="customBudget"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="mt-2"
                                >
                                  <FieldLabel htmlFor={field.name}>
                                    [ OR OFFER CUSTOM PRICE (₹) ]
                                  </FieldLabel>
                                  <input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter custom price, e.g. 2,50,000..."
                                    className="w-full bg-secondary/10 border border-border/30 focus:border-accent p-2.5 focus:outline-none text-accent font-bold text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>

                          <div className="space-y-3">
                            <span className="text-xs uppercase text-foreground font-bold block">
                              [ targetTimeline ] *
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                              {TIMELINE_OPTIONS.map((opt) => (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() =>
                                    setValue("timeline", opt, {
                                      shouldValidate: true,
                                    })
                                  }
                                  className={`border p-3 text-center transition-all font-bold cursor-crosshair ${
                                    watchedTimeline === opt
                                      ? "bg-accent text-accent-foreground border-accent shadow-[2px_2px_0px_var(--color-primary)]"
                                      : "bg-secondary/10 border-border/30 hover:border-accent/50 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            {/* Custom Timeline message field */}
                            <Controller
                              name="customTimeline"
                              control={control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="mt-2"
                                >
                                  <FieldLabel htmlFor={field.name}>
                                    [ OR OFFER CUSTOM TIMELINE ]
                                  </FieldLabel>
                                  <input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter custom timeline, e.g. 3 Weeks..."
                                    className="w-full bg-secondary/10 border border-border/30 focus:border-accent p-2.5 focus:outline-none text-accent font-bold text-xs"
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 3: Technical Specs */}
                      {step === 3 && (
                        <div className="space-y-4 font-mono">
                          <span className="text-xs uppercase text-foreground font-bold block mb-2">
                            [ selectRequiredEngineeringSpecs ] *
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TECH_SPECS.map((spec) => {
                              const isSelected = (watchedSpecs || []).includes(
                                spec,
                              );
                              return (
                                <button
                                  type="button"
                                  key={spec}
                                  onClick={() => handleToggleSpec(spec)}
                                  className={`border p-3 text-left transition-all font-bold flex items-center justify-between cursor-crosshair ${
                                    isSelected
                                      ? "bg-accent text-accent-foreground border-accent shadow-[2px_2px_0px_var(--color-primary)]"
                                      : "bg-secondary/10 border-border/30 hover:border-accent/50 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <span>{spec}</span>
                                  <span>{isSelected ? "[X]" : "[ ]"}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Messages Field */}
                          <Controller
                            name="customMessage"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                className="mt-4"
                              >
                                <FieldLabel htmlFor={field.name}>
                                  [ additionalRequirements ]
                                </FieldLabel>
                                <textarea
                                  {...field}
                                  id={field.name}
                                  rows={3}
                                  aria-invalid={fieldState.invalid}
                                  placeholder="Enter details on page design requirements, database integration constraints, or comments..."
                                  className="w-full bg-secondary/20 border border-border/30 focus:border-accent p-3 focus:outline-none text-accent font-bold text-xs resize-none leading-relaxed"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      )}

                      {/* Step 4: Compile/Transmit Preview */}
                      {step === 4 && (
                        <div className="space-y-6 font-mono">
                          <div className="space-y-2">
                            <span className="text-xs uppercase text-foreground font-black tracking-wider block">
                              READY FOR BLUEPRINT TRANSMISSION
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Your parameters have been fully marshaled. Press
                              compile below to dispatch blueprint via Nodemailer
                              to the developer.
                            </p>
                          </div>

                          {isSubmitting && (
                            <div className="border border-accent/30 bg-accent/5 p-4 flex flex-col gap-1.5 text-[10px] leading-none">
                              {consoleLogs.map((log) => (
                                <div key={log} className="text-emerald-500">
                                  {log}
                                </div>
                              ))}
                              {consoleLogs.length < 7 && (
                                <div className="flex items-center gap-1.5 text-accent animate-pulse font-bold">
                                  <span>COMPILING SCHEMATICS VIA SMTP</span>
                                  <span className="w-1.5 h-3 bg-accent inline-block" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center border-t border-border/20 pt-6 mt-6 w-full font-mono">
                      <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1 || isSubmitting}
                        className="inline-flex items-center gap-1.5 font-bold text-xs hover:text-accent disabled:opacity-30 disabled:hover:text-muted-foreground uppercase py-1"
                      >
                        <ChevronLeft size={14} /> [ BACK ]
                      </button>

                      {step < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="inline-flex items-center gap-1.5 font-bold text-xs hover:text-accent uppercase py-1"
                        >
                          [ NEXT ] <ChevronRight size={14} />
                        </button>
                      ) : (
                        <PixelButton
                          type="submit"
                          disabled={isSubmitting}
                          className="border-accent text-accent shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px]"
                        >
                          {isSubmitting ? "COMPILING..." : "TRANSMIT CONFIG"}{" "}
                          <Send size={12} />
                        </PixelButton>
                      )}
                    </div>
                  </form>
                ) : (
                  /* Booking success block */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col justify-center items-center text-center gap-6 py-6"
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center text-accent animate-pulse">
                      <CheckCircle2 size={32} />
                    </div>
                    <div className="space-y-2 font-mono">
                      <h3 className="font-sans font-black text-2xl tracking-tighter text-foreground uppercase">
                        BLUEPRINT_TRANSMITTED
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        Compilation completed successfully. Your booking request
                        parameters are registered and dispatched via Nodemailer.
                        An engineer will coordinate contact.
                      </p>
                    </div>

                    <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-none font-mono text-[10px] text-emerald-500 max-w-md w-full text-left space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Cpu size={12} />
                        <span>BLUEPRINT TRANSACTION SUCCESS:</span>
                      </div>
                      <div>STATUS: COMPILED_SMTP_DISPATCH</div>
                      <div>
                        TX_ID: TX_BOOK_
                        {Math.random()
                          .toString(36)
                          .substring(2, 10)
                          .toUpperCase()}
                      </div>
                      <div>DISPATCHED: NODEMAILER_SMTP_SERVER</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSuccess(false);
                        setStep(1);
                        reset();
                      }}
                      className="font-mono text-[10px] tracking-widest text-accent uppercase font-bold hover:underline"
                    >
                      [ CONFIGURE_ANOTHER_BLUEPRINT ]
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Live JSON Blueprint Compiler (Subtle Glassmorphism) */}
        <div className="lg:col-span-5 relative flex flex-col">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-[6px] -z-10" />
          <div className="border-2 border-foreground bg-transparent backdrop-blur-[6px] shadow-[8px_8px_0px_var(--color-accent)] p-6 flex-1 flex flex-col justify-between relative overflow-hidden rounded-none min-h-[400px]">
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

            <div className="space-y-4 w-full h-full flex flex-col">
              <div className="flex justify-between items-center border-b border-border/30 pb-3">
                <div className="flex gap-2 items-center text-accent">
                  <Terminal size={14} />
                  <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                    LIVE_BLUEPRINT_COMPILER
                  </span>
                </div>
                <span className="text-[8px] font-mono text-muted-foreground uppercase">
                  [CONFIG_LOG]
                </span>
              </div>

              {/* JSON preview block */}
              <pre className="font-mono text-[10px] sm:text-xs text-foreground/80 overflow-y-auto max-h-[350px] p-4 bg-secondary/10 border border-border/10 flex-1 leading-relaxed select-all scrollbar-thin whitespace-pre">
                <code>{compileJSONString()}</code>
              </pre>

              {/* Display Validation Errors in sidebar */}
              {Object.keys(errors).length > 0 && (
                <div className="border border-red-500/30 bg-red-500/5 p-3 font-mono text-[9px] text-red-500 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <AlertTriangle size={10} />
                    <span>{"VAL_ERRORS // DETECTED"}</span>
                  </div>
                  {Object.entries(errors).map(([key, err]) => (
                    <div key={key} className="pl-3">
                      &bull; {err?.message}
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-dashed border-border/20 pt-4 flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert size={12} className="text-accent" /> SECURE_LINK
                </span>
                <span>STATUS: INTERACTIVE_BUILD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
