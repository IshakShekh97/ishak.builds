"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createProjectAction,
  updateProjectAction,
} from "@/app/actions/project.action";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { ImageUploader } from "@/components/ui/image-uploader";
import { PixelButton } from "@/components/ui/PixelButton";
import type { Project, Tech } from "@/lib/generated/prisma/client";
import { type ProjectSchemaType, projectSchema } from "@/lib/zod.schema";

interface ProjectFormProps {
  initialData?: Project & { techs: Tech[] };
  availableTechs: Tech[];
}

export function ProjectForm({ initialData, availableTechs }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Setup default values based on mode
  const defaultValues: ProjectSchemaType = {
    num: initialData?.num || "01 //",
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "",
    year: initialData?.year || "2026",
    url: initialData?.url || "",
    mockupType: initialData?.mockupType || "terminal",
    description: initialData?.description || "",
    architecturalSolution: initialData?.architecturalSolution || "",
    desc: initialData?.desc || "",
    sol: initialData?.sol || "",
    subtitle: initialData?.subtitle || "",
    challenge: initialData?.challenge || "",
    solution: initialData?.solution || "",
    schemaTitle: initialData?.schemaTitle || "",
    tables: initialData?.tables
      ? JSON.stringify(initialData.tables, null, 2)
      : '[\n  {\n    "name": "UserMetaCache",\n    "columns": ["id", "userId"]\n  }\n]',
    codeSnippet: initialData?.codeSnippet || "",
    metrics: initialData?.metrics
      ? JSON.stringify(initialData.metrics, null, 2)
      : '[\n  {\n    "label": "LATENCY",\n    "value": "< 10ms"\n  }\n]',
    imageUrl: initialData?.imageUrl || "",
    techIds: initialData?.techs.map((t: Tech) => t.id) || [],
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectSchemaType>({
    // biome-ignore lint/suspicious/noExplicitAny: resolver coercion mismatch
    resolver: zodResolver(projectSchema) as any,
    defaultValues,
  });

  const imageUrl = watch("imageUrl");
  const selectedTechs = watch("techIds") || [];

  const handleTechToggle = (techId: string) => {
    const nextTechs = selectedTechs.includes(techId)
      ? selectedTechs.filter((id) => id !== techId)
      : [...selectedTechs, techId];
    setValue("techIds", nextTechs);
  };

  const onSubmit = async (data: ProjectSchemaType) => {
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(false);

    try {
      const result = initialData
        ? await updateProjectAction(initialData.id, data)
        : await createProjectAction(data);

      if (result.success) {
        setActionSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1500);
      } else {
        setActionError(
          result.error || "Execution failed on the database engine.",
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* HUD Message Feed */}
      {actionError && (
        <div className="border border-red-500 bg-red-500/5 p-4 flex gap-3 items-start text-red-500 font-mono text-xs">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">
              DB_TRANSACTION_FAILURE:
            </span>
            {actionError}
          </div>
        </div>
      )}

      {actionSuccess && (
        <div className="border border-emerald-500 bg-emerald-500/5 p-4 flex gap-3 items-start text-emerald-500 font-mono text-xs">
          <CheckCircle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">
              TRANSACTION_SUCCESSFUL:
            </span>
            Project records compiled and synchronized in db. Redirecting...
          </div>
        </div>
      )}

      {/* Segment 1: Metadata parameters */}
      <section className="space-y-6">
        <h2 className="font-sans font-black text-lg uppercase border-b border-foreground/30 pb-2">
          [ 01 / SCHEMATIC_VARIABLES ]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>
              <FieldTitle>Number Prefix</FieldTitle>
              <FieldDescription>
                {"Identifier prefix (e.g. '01 //')"}
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="e.g. 01 //"
                {...register("num")}
              />
              <FieldError errors={errors.num ? [errors.num] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Project Title</FieldTitle>
              <FieldDescription>
                Visual title for the archive list
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="Project title..."
                {...register("title")}
              />
              <FieldError errors={errors.title ? [errors.title] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Slug Identifier</FieldTitle>
              <FieldDescription>
                Lowercase letters, numbers, and hyphens only
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                placeholder="slug-identifier"
                {...register("slug")}
              />
              <FieldError errors={errors.slug ? [errors.slug] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Category</FieldTitle>
              <FieldDescription>Industrial classification tag</FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="e.g. HIGH-PERFORMANCE DATA ROUTER"
                {...register("category")}
              />
              <FieldError
                errors={errors.category ? [errors.category] : undefined}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Build Year</FieldTitle>
              <FieldDescription>Four digit calendar year</FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="e.g. 2026"
                {...register("year")}
              />
              <FieldError errors={errors.year ? [errors.year] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Target URL Route</FieldTitle>
              <FieldDescription>
                Page URL path (e.g. &apos;/archive/slug&apos;)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                placeholder="e.g. /archive/slug"
                {...register("url")}
              />
              <FieldError errors={errors.url ? [errors.url] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Mockup Type</FieldTitle>
              <FieldDescription>Mockup terminal layout type</FieldDescription>
            </FieldLabel>
            <FieldContent>
              <select
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase rounded-none appearance-none"
                {...register("mockupType")}
              >
                <option value="terminal">TERMINAL_SHELL</option>
                <option value="matrix">MATRIX_STREAM</option>
                <option value="charts">GRAPH_ANALYTICS</option>
              </select>
              <FieldError
                errors={errors.mockupType ? [errors.mockupType] : undefined}
              />
            </FieldContent>
          </Field>
        </div>
      </section>

      {/* Segment 2: Summaries & Solved Outcomes */}
      <section className="space-y-6">
        <h2 className="font-sans font-black text-lg uppercase border-b border-foreground/30 pb-2">
          [ 02 / CASE_STUDY_OVERVIEWS ]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>
              <FieldTitle>Business Challenge</FieldTitle>
              <FieldDescription>
                Detailed business problem outline (Landing page)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Describe business pain point..."
                {...register("description")}
              />
              <FieldError
                errors={errors.description ? [errors.description] : undefined}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Architectural Design</FieldTitle>
              <FieldDescription>
                Summary of structural solution (Landing page)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Describe architectural response..."
                {...register("architecturalSolution")}
              />
              <FieldError
                errors={
                  errors.architecturalSolution
                    ? [errors.architecturalSolution]
                    : undefined
                }
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>System Description</FieldTitle>
              <FieldDescription>
                Detailed system summary (Archive page)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Detailed system parameters..."
                {...register("desc")}
              />
              <FieldError errors={errors.desc ? [errors.desc] : undefined} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Architectural Win</FieldTitle>
              <FieldDescription>
                Summary of engineering win (Archive page)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Detailed engineering wins..."
                {...register("sol")}
              />
              <FieldError errors={errors.sol ? [errors.sol] : undefined} />
            </FieldContent>
          </Field>
        </div>
      </section>

      {/* Segment 3: Detailed Case Studies */}
      <section className="space-y-6">
        <h2 className="font-sans font-black text-lg uppercase border-b border-foreground/30 pb-2">
          [ 03 / DETAILED_METRIC_CASE_STUDIES ]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>
              <FieldTitle>Study Subtitle</FieldTitle>
              <FieldDescription>
                Technical title (e.g. &apos;SSR_PERFORMANCE_OVERHAUL&apos;)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="e.g. SSR_PERFORMANCE_OVERHAUL"
                {...register("subtitle")}
              />
              <FieldError
                errors={errors.subtitle ? [errors.subtitle] : undefined}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Engineering Challenge</FieldTitle>
              <FieldDescription>
                Detailed challenge text (Study view)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Detailed technical bottleneck..."
                {...register("challenge")}
              />
              <FieldError
                errors={errors.challenge ? [errors.challenge] : undefined}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Engineering Solution</FieldTitle>
              <FieldDescription>
                Detailed solution text (Study view)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={4}
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                placeholder="Detailed technical remediation..."
                {...register("solution")}
              />
              <FieldError
                errors={errors.solution ? [errors.solution] : undefined}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>
              <FieldTitle>Database Schema Title</FieldTitle>
              <FieldDescription>
                Schema label (e.g. &apos;PostgreSQL Schema Architecture&apos;)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                placeholder="e.g. PostgreSQL Schema Architecture"
                {...register("schemaTitle")}
              />
              <FieldError
                errors={errors.schemaTitle ? [errors.schemaTitle] : undefined}
              />
            </FieldContent>
          </Field>
        </div>
      </section>

      {/* Segment 4: Code block & JSON matrices */}
      <section className="space-y-6">
        <h2 className="font-sans font-black text-lg uppercase border-b border-foreground/30 pb-2">
          [ 04 / DATA_SCHEMAS_AND_CODE ]
        </h2>
        <div className="space-y-6">
          <Field>
            <FieldLabel>
              <FieldTitle>Code Snippet Demonstration</FieldTitle>
              <FieldDescription>
                Relevant code sample (TypeScript, JS, Rust, SQL)
              </FieldDescription>
            </FieldLabel>
            <FieldContent>
              <textarea
                rows={10}
                className="bg-background border-2 border-foreground p-4 focus:border-accent focus:outline-none font-mono text-xs leading-relaxed resize-y min-h-[250px]"
                placeholder="// Sample algorithm..."
                {...register("codeSnippet")}
              />
              <FieldError
                errors={errors.codeSnippet ? [errors.codeSnippet] : undefined}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <FieldLabel>
                <FieldTitle>Schema Tables Configuration (JSON)</FieldTitle>
                <FieldDescription>
                  Valid JSON array detailing tables and columns
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                <textarea
                  rows={8}
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                  placeholder="JSON array format..."
                  {...register("tables")}
                />
                <FieldError
                  errors={errors.tables ? [errors.tables] : undefined}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Metrics Data Metrics (JSON)</FieldTitle>
                <FieldDescription>
                  Valid JSON array detailing performance metrics
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                <textarea
                  rows={8}
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                  placeholder="JSON array format..."
                  {...register("metrics")}
                />
                <FieldError
                  errors={errors.metrics ? [errors.metrics] : undefined}
                />
              </FieldContent>
            </Field>
          </div>
        </div>
      </section>

      {/* Segment 5: Asset Ingestion & Tech Selection */}
      <section className="space-y-6">
        <h2 className="font-sans font-black text-lg uppercase border-b border-foreground/30 pb-2">
          [ 05 / ARCHIVE_ASSETS_AND_DEPENDENCIES ]
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Uploader (Left) */}
          <div className="lg:col-span-6 space-y-4">
            <Field>
              <FieldLabel>
                <FieldTitle>Mockup Screenshot Image</FieldTitle>
                <FieldDescription>
                  Upload mockup asset to Cloudinary server
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                {/* Upload Preview if URL exists */}
                {imageUrl ? (
                  <div className="border border-border/30 bg-background/50 p-4 flex flex-col items-center gap-4 relative shadow-[4px_4px_0px_var(--color-accent)]">
                    {/* biome-ignore lint/performance/noImgElement: standard img element needed for Cloudinary dynamic preview */}
                    <img
                      src={imageUrl}
                      alt="Project upload Preview"
                      className="w-full aspect-video object-cover border border-foreground"
                    />
                    <div className="w-full flex justify-between items-center text-[10px]">
                      <span className="truncate text-muted-foreground max-w-[250px]">
                        {imageUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => setValue("imageUrl", "")}
                        className="flex items-center gap-1 text-red-500 font-bold uppercase hover:underline"
                      >
                        <Trash size={10} /> Delete Asset
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUploader
                    aspectRatio="16:9"
                    label="UPLOAD PROJECT IMAGE"
                    onUploadSuccess={(url) => setValue("imageUrl", url)}
                  />
                )}
                <FieldError
                  errors={errors.imageUrl ? [errors.imageUrl] : undefined}
                />
              </FieldContent>
            </Field>
          </div>

          {/* Technology Nodes Checkboxes (Right) */}
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-xs uppercase text-foreground font-bold block">
              LINKED_TECHNOLOGY_STACK
            </span>
            <span className="font-mono text-[9px] text-muted-foreground block uppercase">
              SELECT COMPILER NODES INTEGRATED INTO THIS SYSTEM:
            </span>

            {availableTechs.length === 0 ? (
              <div className="border border-dashed border-foreground/30 p-6 text-center text-xs text-muted-foreground">
                NO_TECH_STACKS_FOUND. CREATE NODES IN THE TECH CRUD PANEL FIRST.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto border border-border/20 p-3 bg-secondary/5">
                {availableTechs.map((tech) => {
                  const selected = selectedTechs.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => handleTechToggle(tech.id)}
                      className={`border px-3 py-2 text-left font-mono text-[10px] uppercase font-bold transition-all flex justify-between items-center ${
                        selected
                          ? "bg-accent border-accent text-accent-foreground"
                          : "border-border/30 hover:border-accent bg-background"
                      }`}
                    >
                      <span className="truncate mr-2">{tech.name}</span>
                      {selected && <CheckCircle size={10} />}
                    </button>
                  );
                })}
              </div>
            )}
            <FieldError
              errors={errors.techIds ? [errors.techIds] : undefined}
            />
          </div>
        </div>
      </section>

      {/* Form Submission Action Banner */}
      <div className="border-t-2 border-foreground pt-6 flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="font-mono text-xs uppercase font-bold text-muted-foreground hover:text-foreground border border-border/30 px-6 py-3 transition-all"
        >
          Cancel Operation
        </button>

        <PixelButton
          type="submit"
          disabled={isSubmitting}
          className="border-accent text-accent shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Save size={12} className="mr-1.5" />
          {isSubmitting ? "SYNCING_ENGINE..." : "COMPILE_AND_SAVE"}
        </PixelButton>
      </div>
    </form>
  );
}
