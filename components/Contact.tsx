"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Field } from "@/components/ui/field";
import { usePreloader } from "./PreloaderContext";
import { PixelButton } from "./ui/PixelButton";
import { TextReveal } from "./ui/TextReveal";

const contactSchema = z.object({
  senderName: z.string().min(1, "Name is required (senderName)"),
  senderEmail: z.string().email("Invalid email address format (senderEmail)"),
  projectSubject: z.string().min(1, "Subject is required (projectSubject)"),
  clientMessage: z
    .string()
    .min(5, "Message must be at least 5 characters (clientMessage)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { isCompleted } = usePreloader();

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      senderName: "",
      senderEmail: "",
      projectSubject: "",
      clientMessage: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitLogs([]);

    const logSequence = [
      "SYS // ESTABLISHING SOCKET HOOK...",
      "PACK // MARSHALING CLIENT CONFIG...",
      "VAL // VALIDATING COMPILER INPUTS: OK",
      "SEC // ENCRYPTING DATA (AES-256): OK",
      "SMTP // INITIALIZING MAIL DEPLOYMENT NODE...",
      "CORE // DISPATCHING PACKETS TO ENGINE...",
    ];

    for (let i = 0; i < logSequence.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setSubmitLogs((prev) => [...prev, logSequence[i]]);
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.senderName,
          email: data.senderEmail,
          subject: data.projectSubject,
          message: data.clientMessage,
        }),
      });

      if (response.ok) {
        setSubmitLogs((prev) => [
          ...prev,
          "DONE // HANDSHAKE SUCCESSFUL [STATUS_200]",
        ]);
        await new Promise((resolve) => setTimeout(resolve, 350));
        setIsSuccess(true);
        reset();
      } else {
        setSubmitLogs((prev) => [
          ...prev,
          "ERR // DISPATCH FAILED [STATUS_500]",
        ]);
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Unknown error";
      setSubmitLogs((prev) => [
        ...prev,
        `ERR // CONNECTION LOST: ${errMessage}`,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="connect"
      initial={{ opacity: 0, y: 40 }}
      whileInView={isCompleted ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
      className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-20 md:py-28 border-b border-border/30 relative z-20 flex flex-col gap-12 select-none overflow-hidden"
    >
      {/* Title */}
      <div className="border-l-4 md:border-l-12px border-accent pl-6 md:pl-10 py-2">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold block mb-1">
          {"// 04 // INITIALIZE_COMMUNICATIONS"}
        </span>
        <h2 className="font-sans font-black text-4xl sm:text-6xl md:text-[6.5vw] uppercase tracking-tighter leading-none">
          <TextReveal text="SECURE" className="text-foreground" />
          <TextReveal text="CONNECTION" className="text-accent" />
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch w-full">
        {/* Left column: Text Specs */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8 py-2">
          <div className="space-y-4">
            <span className="font-sans font-extrabold text-lg sm:text-2xl tracking-tight text-foreground uppercase block">
              THE CONVERSION GATEWAY
            </span>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Standard input fields are inefficient. Compile your project
              parameters, transmission metadata, and inquiry details directly
              into our environment schema format.
            </p>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Upon submission, packets are dispatched via SMTP directly to our
              mailbox, triggering compiler hooks for prompt execution.
            </p>
          </div>

          <div className="font-mono text-[10px] border border-border/30 p-4 bg-secondary/5 space-y-2 max-w-md">
            <div className="flex justify-between border-b border-border/10 pb-1">
              <span className="text-muted-foreground">HOST</span>
              <span className="font-bold text-foreground">
                VERCEL_EDGE_ROUTER
              </span>
            </div>
            <div className="flex justify-between border-b border-border/10 pb-1">
              <span className="text-muted-foreground">SSL_ENCRYPTION</span>
              <span className="font-bold text-accent">AES-256-GCM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">QUEUE_GATEWAY</span>
              <span className="font-bold text-foreground">NODEMAILER_SMTP</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Form Terminal (Subtle Glassmorphism) */}
        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-accent/5 backdrop-blur-[6px] -z-10" />

          <div className="border-2 border-foreground bg-transparent backdrop-blur-[6px] shadow-[8px_8px_0px_var(--color-accent)] p-4 sm:p-6 flex flex-col min-h-[460px] justify-between relative overflow-hidden">
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

            {/* Terminal Header */}
            <div className="flex justify-between items-center border-b border-border/30 pb-3 mb-4 w-full">
              <div className="flex gap-1.5 items-center text-accent">
                <Terminal size={14} />
                <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
                  CLIENT_SHELL_V2.0
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYS_CONNECTED</span>
              </div>
            </div>

            {/* Terminal Screen Canvas */}
            <div className="flex-1 flex flex-col justify-between font-mono text-xs sm:text-sm">
              {!isSuccess ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex-1 flex flex-col justify-between gap-6"
                >
                  {/* JSON Schema String Block */}
                  <div className="text-muted-foreground space-y-1 sm:space-y-2 leading-relaxed">
                    <div>
                      <span className="text-blue-500 font-bold">const</span>{" "}
                      <span className="text-amber-500 font-bold">
                        projectScope
                      </span>{" "}
                      = <span className="text-foreground font-bold">{"{"}</span>
                    </div>

                    {/* senderName field */}
                    <div className="pl-6 flex flex-wrap items-center gap-x-2">
                      <Controller
                        name="senderName"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            orientation="horizontal"
                            className="w-auto gap-0"
                          >
                            <span className="text-foreground">senderName:</span>
                            <span className="text-emerald-500">&quot;</span>
                            <input
                              {...field}
                              id="senderName"
                              type="text"
                              onFocus={() => setActiveInput("name")}
                              onBlur={() => {
                                field.onBlur();
                                setActiveInput(null);
                              }}
                              placeholder="your name..."
                              className="bg-transparent text-accent border border-transparent focus:border-accent focus:outline-none px-1 rounded-sm min-w-[140px] placeholder:text-accent/30 font-bold"
                            />
                            <span className="text-emerald-500">&quot;</span>
                            <span className="text-foreground">,</span>
                            {activeInput === "name" && (
                              <span className="text-accent animate-pulse font-bold text-xs ml-2">
                                [EDITING]
                              </span>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* senderEmail field */}
                    <div className="pl-6 flex flex-wrap items-center gap-x-2">
                      <Controller
                        name="senderEmail"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            orientation="horizontal"
                            className="w-auto gap-0"
                          >
                            <span className="text-foreground">
                              senderEmail:
                            </span>
                            <span className="text-emerald-500">&quot;</span>
                            <input
                              {...field}
                              id="senderEmail"
                              type="text"
                              onFocus={() => setActiveInput("email")}
                              onBlur={() => {
                                field.onBlur();
                                setActiveInput(null);
                              }}
                              placeholder="your email..."
                              className="bg-transparent text-accent border border-transparent focus:border-accent focus:outline-none px-1 rounded-sm min-w-[140px] placeholder:text-accent/30 font-bold"
                            />
                            <span className="text-emerald-500">&quot;</span>
                            <span className="text-foreground">,</span>
                            {activeInput === "email" && (
                              <span className="text-accent animate-pulse font-bold text-xs ml-2">
                                [EDITING]
                              </span>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* projectSubject field */}
                    <div className="pl-6 flex flex-wrap items-center gap-x-2">
                      <Controller
                        name="projectSubject"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            orientation="horizontal"
                            className="w-auto gap-0"
                          >
                            <span className="text-foreground">
                              projectSubject:
                            </span>
                            <span className="text-emerald-500">&quot;</span>
                            <input
                              {...field}
                              id="projectSubject"
                              type="text"
                              onFocus={() => setActiveInput("subject")}
                              onBlur={() => {
                                field.onBlur();
                                setActiveInput(null);
                              }}
                              placeholder="inquiry subject..."
                              className="bg-transparent text-accent border border-transparent focus:border-accent focus:outline-none px-1 rounded-sm min-w-[180px] placeholder:text-accent/30 font-bold"
                            />
                            <span className="text-emerald-500">&quot;</span>
                            <span className="text-foreground">,</span>
                            {activeInput === "subject" && (
                              <span className="text-accent animate-pulse font-bold text-xs ml-2">
                                [EDITING]
                              </span>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* clientMessage field */}
                    <div className="pl-6 flex flex-wrap items-start gap-x-2 w-full">
                      <Controller
                        name="clientMessage"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            orientation="horizontal"
                            className="w-full gap-0"
                          >
                            <span className="text-foreground">
                              clientMessage:
                            </span>
                            <span className="text-emerald-500">&quot;</span>
                            <textarea
                              {...field}
                              id="clientMessage"
                              rows={2}
                              onFocus={() => setActiveInput("message")}
                              onBlur={() => {
                                field.onBlur();
                                setActiveInput(null);
                              }}
                              placeholder="describe your architectural wins/goals..."
                              className="bg-transparent text-accent border border-transparent focus:border-accent focus:outline-none px-1 rounded-sm min-w-[200px] flex-1 max-w-full placeholder:text-accent/30 font-bold resize-none leading-snug"
                            />
                            <span className="text-emerald-500">&quot;</span>
                            {activeInput === "message" && (
                              <span className="text-accent animate-pulse font-bold text-xs shrink-0 ml-2">
                                [EDITING]
                              </span>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    <div>
                      <span className="text-foreground font-bold">{"};"}</span>
                    </div>
                  </div>

                  {/* Submission Console Feed */}
                  {(isSubmitting || Object.keys(errors).length > 0) && (
                    <div className="border border-accent/30 bg-accent/5 p-3 flex flex-col gap-1.5 text-[10px] leading-none">
                      {/* Form Validation Errors log */}
                      {Object.entries(errors).map(([key, err]) => (
                        <div
                          key={key}
                          className="text-red-500 flex items-center gap-1 font-bold"
                        >
                          <AlertTriangle size={10} />
                          <span>
                            {"ERR_VAL // "}
                            {err?.message}
                          </span>
                        </div>
                      ))}

                      {/* submission status logs */}
                      {isSubmitting && (
                        <>
                          {submitLogs.map((log) => (
                            <div key={log} className="text-emerald-500">
                              {log}
                            </div>
                          ))}
                          {submitLogs.length < 6 && (
                            <div className="flex items-center gap-1.5 text-accent animate-pulse font-bold">
                              <span>STREAMING PACKETS VIA SMTP</span>
                              <span className="w-1.5 h-3 bg-accent inline-block" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex justify-end pt-4 border-t border-border/20">
                    <PixelButton
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 border-accent text-accent shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                      {isSubmitting ? "TRANSMITTING..." : "RUN CONNECT_SOCKET"}{" "}
                      <Send size={12} />
                    </PixelButton>
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex-1 flex flex-col justify-center items-center text-center gap-6 py-6"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-accent flex items-center justify-center text-accent animate-pulse">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-2xl tracking-tighter text-foreground uppercase">
                      TRANSMISSION_COMPLETE
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                      Your configuration variables have been compiled and
                      emailed successfully via Nodemailer. Expect a core sync
                      handshake soon.
                    </p>
                  </div>

                  <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-none font-mono text-[10px] text-emerald-500 max-w-md w-full text-left space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck size={12} />
                      <span>SECURE INTEGRITY LOG:</span>
                    </div>
                    <div>STATUS: 200 OK (MAIL_DISPATCHED)</div>
                    <div>
                      PACKET_HASH: SHA256_
                      {Math.random()
                        .toString(36)
                        .substring(2, 10)
                        .toUpperCase()}
                    </div>
                    <div>SOCKET_CONNECTION: COMPLETED_ESTABLISHED</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                    }}
                    className="font-mono text-[10px] tracking-widest text-accent uppercase font-bold hover:underline"
                  >
                    [ INITIALIZE_NEW_TRANSMISSION ]
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
