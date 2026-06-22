"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  Edit2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createTechAction,
  deleteTechAction,
  updateTechAction,
} from "@/app/actions/tech.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { PixelButton } from "@/components/ui/PixelButton";
import type { Tech } from "@/lib/generated/prisma/client";
import { type TechSchemaType, techSchema } from "@/lib/zod.schema";

interface TechManagerProps {
  techs: Tech[];
}

export function TechManager({ techs }: TechManagerProps) {
  const router = useRouter();
  const [editingTech, setEditingTech] = useState<Tech | null>(null);
  const [deletingTech, setDeletingTech] = useState<Tech | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState(false);

  // Setup form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TechSchemaType>({
    // biome-ignore lint/suspicious/noExplicitAny: resolver coercion mismatch
    resolver: zodResolver(techSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      showOnLanding: false,
      landingRow: 1,
      landingOrder: 0,
    },
  });

  const onSubmit = async (data: TechSchemaType) => {
    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(false);

    try {
      const res = editingTech
        ? await updateTechAction(editingTech.id, data)
        : await createTechAction(data);

      if (res.success) {
        setActionSuccess(true);
        reset({
          name: "",
          slug: "",
          showOnLanding: false,
          landingRow: 1,
          landingOrder: 0,
        });
        setEditingTech(null);
        router.refresh();
      } else {
        setActionError(res.error || "Operation failed on DB engine.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (tech: Tech) => {
    setEditingTech(tech);
    setValue("name", tech.name);
    setValue("slug", tech.slug);
    setValue("showOnLanding", tech.showOnLanding);
    setValue("landingRow", tech.landingRow || 1);
    setValue("landingOrder", tech.landingOrder);
  };

  const handleCancelEdit = () => {
    setEditingTech(null);
    reset(
      {
        name: "",
        slug: "",
        showOnLanding: false,
        landingRow: 1,
        landingOrder: 0,
      },
      { keepDefaultValues: false },
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTech) return;
    setIsSubmitting(true);
    setActionError(null);

    try {
      const res = await deleteTechAction(deletingTech.id);
      if (res.success) {
        setDeletingTech(null);
        router.refresh();
      } else {
        setActionError(res.error || "Failed to remove tech node.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* HUD Message Feed */}
      {actionError && (
        <div className="lg:col-span-12 border border-red-500 bg-red-500/5 p-4 flex gap-3 items-start text-red-500 font-mono text-xs">
          <AlertTriangle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">
              COMPILER_INSTRUCTION_FAILURE:
            </span>
            {actionError}
          </div>
        </div>
      )}

      {actionSuccess && (
        <div className="lg:col-span-12 border border-emerald-500 bg-emerald-500/5 p-4 flex gap-3 items-start text-emerald-500 font-mono text-xs">
          <CheckCircle className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">
              NODE_SYNCHRONIZED:
            </span>
            Technology stack schema variables updated successfully.
          </div>
        </div>
      )}

      {/* Left Column: Tech Nodes Registry List */}
      <div className="lg:col-span-7 space-y-4 w-full">
        <span className="font-mono text-xs uppercase text-foreground font-bold block">
          COMPILER_NODE_REGISTRY
        </span>

        {techs.length === 0 ? (
          <div className="border-2 border-foreground p-8 text-center text-muted-foreground uppercase text-xs">
            [ NO_COMPILE_NODES_FOUND_IN_SYSTEM_DATABASE ]
          </div>
        ) : (
          <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] overflow-x-auto w-full">
            <table className="w-full text-left font-mono text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-foreground text-background border-b border-foreground uppercase font-black tracking-wider text-[10px]">
                  <th className="p-3">Node Name</th>
                  <th className="p-3">Slug Route</th>
                  <th className="p-3">Landing Row</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/20">
                {techs.map((tech) => (
                  <tr
                    key={tech.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="p-3 font-bold text-foreground flex items-center gap-2">
                      <Cpu size={12} className="text-accent shrink-0" />
                      <span>{tech.name}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{tech.slug}</td>
                    <td className="p-3">
                      {tech.showOnLanding ? (
                        <span className="text-emerald-500 font-bold">
                          ROW_{tech.landingRow}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">
                          [HIDDEN]
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-foreground font-bold">
                      {tech.landingOrder}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleEditClick(tech)}
                          className="border border-border/35 bg-secondary/5 hover:border-accent hover:text-accent p-1 text-[10px] uppercase font-bold"
                          title="Edit Node"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingTech(tech)}
                          className="border border-destructive/30 bg-destructive/5 hover:bg-destructive hover:text-white p-1 text-[10px] uppercase font-bold text-destructive"
                          title="Delete Node"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Right Column: Node Form Panel */}
      <div className="lg:col-span-5 space-y-4 w-full">
        <span className="font-mono text-xs uppercase text-foreground font-bold block">
          {editingTech ? "EDIT_NODE_DECLARATION" : "DECLARE_NEW_COMPILER_NODE"}
        </span>

        <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-accent)] p-6 relative">
          {/* Corner Decorators */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field>
              <FieldLabel>
                <FieldTitle>Node Name</FieldTitle>
                <FieldDescription>
                  Technology name (e.g. &apos;React&apos;)
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                <input
                  type="text"
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                  placeholder="e.g. Next.js"
                  {...register("name")}
                />
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Slug Identifier</FieldTitle>
                <FieldDescription>
                  Lowercase alphanumeric & hyphens only
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                <input
                  type="text"
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                  placeholder="e.g. next-js"
                  {...register("slug")}
                />
                <FieldError errors={errors.slug ? [errors.slug] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="flex-row items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4 bg-background border-2 border-foreground focus:ring-0 accent-accent cursor-pointer"
                  {...register("showOnLanding")}
                />
                <div>
                  <FieldTitle>Render on Landing page</FieldTitle>
                  <FieldDescription>
                    Enable scrolling ticker row entry
                  </FieldDescription>
                </div>
              </FieldLabel>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  <FieldTitle>Ticker Row</FieldTitle>
                  <FieldDescription>Row 1 or Row 2</FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <select
                    className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase rounded-none appearance-none"
                    {...register("landingRow")}
                  >
                    <option value={1}>ROW 1 (TOP)</option>
                    <option value={2}>ROW 2 (BOTTOM)</option>
                  </select>
                  <FieldError
                    errors={errors.landingRow ? [errors.landingRow] : undefined}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>Ticker Order</FieldTitle>
                  <FieldDescription>Order relative index</FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="number"
                    className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                    {...register("landingOrder")}
                  />
                  <FieldError
                    errors={
                      errors.landingOrder ? [errors.landingOrder] : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <div className="flex gap-3 justify-end border-t border-border/20 pt-4">
              {editingTech && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="font-mono text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2"
                >
                  Cancel
                </button>
              )}

              <PixelButton
                type="submit"
                disabled={isSubmitting}
                className="border-accent text-accent py-2 px-5 text-[10px]"
              >
                {editingTech ? (
                  <>
                    <Save size={12} className="mr-1.5" /> RECOMPILE_NODE
                  </>
                ) : (
                  <>
                    <Plus size={12} className="mr-1.5" /> REGISTER_NODE
                  </>
                )}
              </PixelButton>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal (Radix Dialog) */}
      <Dialog
        open={!!deletingTech}
        onOpenChange={(open) => !open && setDeletingTech(null)}
      >
        <DialogContent className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-destructive)] p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={18} className="animate-bounce" /> WARNING:
              DESTRUCTIVE_ACTION
            </DialogTitle>
            <DialogDescription className="font-mono text-xs leading-normal">
              You are instructing the compiler to purge the technology node{" "}
              <strong className="text-foreground font-black uppercase">
                [{deletingTech?.name}]
              </strong>{" "}
              from the schema registries. This action will detach this tech tag
              from any associated projects.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button
              type="button"
              onClick={() => setDeletingTech(null)}
              className="font-mono text-xs uppercase font-bold text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2"
            >
              Cancel Operation
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDeleteConfirm}
              className="font-mono text-xs uppercase font-bold bg-destructive text-white border border-destructive hover:bg-transparent hover:text-destructive px-5 py-2 transition-all cursor-crosshair disabled:opacity-50"
            >
              Confirm Purge
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
