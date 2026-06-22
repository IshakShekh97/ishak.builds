"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle,
  Edit2,
  ExternalLink,
  Plus,
  Save,
  Trash,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  createBioLinkAction,
  deleteBioLinkAction,
  updateBioLinkAction,
  updateBioProfileAction,
} from "@/app/actions/bio.action";
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
import { ImageUploader } from "@/components/ui/image-uploader";
import { PixelButton } from "@/components/ui/PixelButton";
import type { BioLink, BioProfile } from "@/lib/generated/prisma/client";
import {
  type BioLinkSchemaType,
  type BioProfileSchemaType,
  bioLinkSchema,
  bioProfileSchema,
} from "@/lib/zod.schema";

interface LinksManagerProps {
  profile: BioProfile & { links: BioLink[] };
}

export function LinksManager({ profile }: LinksManagerProps) {
  const router = useRouter();

  // Profile form state
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Links state
  const [editingLink, setEditingLink] = useState<BioLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<BioLink | null>(null);
  const [linkSubmitting, setLinkSubmitting] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // BioProfile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors },
  } = useForm<BioProfileSchemaType>({
    // biome-ignore lint/suspicious/noExplicitAny: resolver coercion mismatch
    resolver: zodResolver(bioProfileSchema) as any,
    defaultValues: {
      name: profile.name,
      initials: profile.initials,
      avatarUrl: profile.avatarUrl || "",
      beaconText: profile.beaconText,
      bio: profile.bio || "",
    },
  });

  const profileAvatarUrl = watchProfile("avatarUrl");

  // BioLink Form
  const {
    register: registerLink,
    handleSubmit: handleSubmitLink,
    setValue: setLinkValue,
    reset: resetLink,
    formState: { errors: linkErrors },
  } = useForm<BioLinkSchemaType>({
    // biome-ignore lint/suspicious/noExplicitAny: resolver coercion mismatch
    resolver: zodResolver(bioLinkSchema) as any,
    defaultValues: {
      label: "",
      desc: "",
      url: "",
      isExternal: false,
      order: 0,
    },
  });

  // Profile Submit
  const onProfileSubmit = async (data: BioProfileSchemaType) => {
    setProfileSubmitting(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const res = await updateBioProfileAction(data);
      if (res.success) {
        setProfileSuccess(true);
        router.refresh();
      } else {
        setProfileError(res.error || "Profile compile update failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setProfileError(msg);
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Link Submit
  const onLinkSubmit = async (data: BioLinkSchemaType) => {
    setLinkSubmitting(true);
    setLinkError(null);
    setLinkSuccess(false);

    try {
      const res = editingLink
        ? await updateBioLinkAction(editingLink.id, data)
        : await createBioLinkAction(data);

      if (res.success) {
        setLinkSuccess(true);
        resetLink({
          label: "",
          desc: "",
          url: "",
          isExternal: false,
          order: 0,
        });
        setEditingLink(null);
        router.refresh();
      } else {
        setLinkError(res.error || "Link transaction failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLinkError(msg);
    } finally {
      setLinkSubmitting(false);
    }
  };

  const handleLinkEditClick = (link: BioLink) => {
    setEditingLink(link);
    setLinkValue("label", link.label);
    setLinkValue("desc", link.desc || "");
    setLinkValue("url", link.url);
    setLinkValue("isExternal", link.isExternal);
    setLinkValue("order", link.order);
  };

  const handleCancelLinkEdit = () => {
    setEditingLink(null);
    resetLink({
      label: "",
      desc: "",
      url: "",
      isExternal: false,
      order: 0,
    });
  };

  const handleLinkDeleteConfirm = async () => {
    if (!deletingLink) return;
    setLinkSubmitting(true);
    setLinkError(null);

    try {
      const res = await deleteBioLinkAction(deletingLink.id);
      if (res.success) {
        setDeletingLink(null);
        router.refresh();
      } else {
        setLinkError(res.error || "Failed to remove link routing record.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLinkError(msg);
    } finally {
      setLinkSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
      {/* 1. Profile settings (Left Column) */}
      <div className="xl:col-span-5 space-y-4 w-full">
        <span className="font-mono text-xs uppercase text-foreground font-bold block">
          BIOPROFILE_IDENTITY_SCHEMA
        </span>

        <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] p-6 relative">
          {/* Corner Decorators */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-foreground/30" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-foreground/30" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-foreground/30" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-foreground/30" />

          <form
            onSubmit={handleSubmitProfile(onProfileSubmit)}
            className="space-y-6"
          >
            {profileError && (
              <div className="border border-red-500 bg-red-500/5 p-3 flex gap-2 items-start text-red-500 font-mono text-[10px]">
                <AlertTriangle className="shrink-0 mt-0.5" size={14} />
                <div>
                  <span className="font-bold uppercase block">
                    PROFILE_COMPILE_FAILURE:
                  </span>
                  {profileError}
                </div>
              </div>
            )}

            {profileSuccess && (
              <div className="border border-emerald-500 bg-emerald-500/5 p-3 flex gap-2 items-start text-emerald-500 font-mono text-[10px]">
                <CheckCircle className="shrink-0 mt-0.5" size={14} />
                <div>
                  <span className="font-bold uppercase block">
                    PROFILE_COMPILED:
                  </span>
                  Identity parameters saved on DB host.
                </div>
              </div>
            )}

            <Field>
              <FieldLabel>
                <FieldTitle>Avatar image upload</FieldTitle>
                <FieldDescription>
                  Standard 1:1 image upload to Cloudinary
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                {profileAvatarUrl ? (
                  <div className="border border-border/30 bg-background/50 p-4 flex flex-col items-center gap-3 relative shadow-[4px_4px_0px_var(--color-accent)]">
                    {/* biome-ignore lint/performance/noImgElement: standard img element needed for Cloudinary dynamic preview */}
                    <img
                      src={profileAvatarUrl}
                      alt="Avatar Preview"
                      className="size-20 rounded-full border-2 border-foreground object-cover"
                    />
                    <div className="w-full flex justify-between items-center text-[10px]">
                      <span className="truncate text-muted-foreground max-w-[150px]">
                        {profileAvatarUrl}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProfileValue("avatarUrl", "")}
                        className="flex items-center gap-1 text-red-500 font-bold uppercase hover:underline"
                      >
                        <Trash size={10} /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <ImageUploader
                    aspectRatio="1:1"
                    label="UPLOAD AVATAR IMAGE"
                    onUploadSuccess={(url) => setProfileValue("avatarUrl", url)}
                  />
                )}
                <FieldError
                  errors={
                    profileErrors.avatarUrl
                      ? [profileErrors.avatarUrl]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Identity Name</FieldTitle>
                <FieldDescription>Visual profile name display</FieldDescription>
              </FieldLabel>
              <FieldContent>
                <input
                  type="text"
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                  placeholder="e.g. ISHAK.BUILDS"
                  {...registerProfile("name")}
                />
                <FieldError
                  errors={profileErrors.name ? [profileErrors.name] : undefined}
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>
                  <FieldTitle>Initials</FieldTitle>
                  <FieldDescription>Fallback letters</FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="text"
                    maxLength={2}
                    className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                    placeholder="e.g. IS"
                    {...registerProfile("initials")}
                  />
                  <FieldError
                    errors={
                      profileErrors.initials
                        ? [profileErrors.initials]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>Beacon Text</FieldTitle>
                  <FieldDescription>Diagnostic status label</FieldDescription>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="text"
                    className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                    placeholder="e.g. SYSTEM_ACTIVE"
                    {...registerProfile("beaconText")}
                  />
                  <FieldError
                    errors={
                      profileErrors.beaconText
                        ? [profileErrors.beaconText]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>
                <FieldTitle>Biographical description</FieldTitle>
                <FieldDescription>
                  Text detailing professional parameter summaries
                </FieldDescription>
              </FieldLabel>
              <FieldContent>
                <textarea
                  rows={4}
                  className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs leading-normal resize-none"
                  placeholder="Developer bio..."
                  {...registerProfile("bio")}
                />
                <FieldError
                  errors={profileErrors.bio ? [profileErrors.bio] : undefined}
                />
              </FieldContent>
            </Field>

            <div className="flex justify-end border-t border-border/20 pt-4">
              <PixelButton
                type="submit"
                disabled={profileSubmitting}
                className="border-accent text-accent py-2 px-5 text-[10px]"
              >
                <Save size={12} className="mr-1.5" />
                {profileSubmitting ? "COMPILE_IDENTITY..." : "COMPILE_IDENTITY"}
              </PixelButton>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Routing links registry (Right Column) */}
      <div className="xl:col-span-7 space-y-8 w-full">
        {/* Registry list */}
        <div className="space-y-4">
          <span className="font-mono text-xs uppercase text-foreground font-bold block">
            BIOLINK_ROUTING_REGISTRY
          </span>

          {profile.links.length === 0 ? (
            <div className="border-2 border-foreground p-8 text-center text-muted-foreground uppercase text-xs">
              [ NO_ROUTING_LINKS_DECLARED_IN_SCHEMA ]
            </div>
          ) : (
            <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-foreground)] overflow-x-auto w-full">
              <table className="w-full text-left font-mono text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-foreground text-background border-b border-foreground uppercase font-black tracking-wider text-[10px]">
                    <th className="p-3">Label</th>
                    <th className="p-3">URL Route</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Order</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/20">
                  {profile.links.map((link: BioLink) => (
                    <tr
                      key={link.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="p-3">
                        <span className="font-bold text-foreground block">
                          {link.label}
                        </span>
                        {link.desc && (
                          <span className="text-[10px] text-muted-foreground block font-normal max-w-xs truncate normal-case">
                            {link.desc}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-accent underline underline-offset-2">
                        {link.url}
                      </td>
                      <td className="p-3">
                        {link.isExternal ? (
                          <span className="text-amber-500 font-bold flex items-center gap-1 text-[10px]">
                            EXTERNAL <ExternalLink size={8} />
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-bold text-[10px]">
                            INTERNAL
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-foreground font-bold">
                        {link.order}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => handleLinkEditClick(link)}
                            className="border border-border/35 bg-secondary/5 hover:border-accent hover:text-accent p-1 text-[10px] uppercase font-bold"
                            title="Edit Link"
                          >
                            <Edit2 size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingLink(link)}
                            className="border border-destructive/30 bg-destructive/5 hover:bg-destructive hover:text-white p-1 text-[10px] uppercase font-bold text-destructive"
                            title="Delete Link"
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

        {/* Link Registry Form */}
        <div className="space-y-4">
          <span className="font-mono text-xs uppercase text-foreground font-bold block">
            {editingLink
              ? "DECLARE_LINK_MODIFICATION"
              : "REGISTER_NEW_ROUTING_LINK"}
          </span>

          <div className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-accent)] p-6 relative">
            {/* Corner Decorators */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />

            <form
              onSubmit={handleSubmitLink(onLinkSubmit)}
              className="space-y-6"
            >
              {linkError && (
                <div className="border border-red-500 bg-red-500/5 p-3 flex gap-2 items-start text-red-500 font-mono text-[10px]">
                  <AlertTriangle className="shrink-0 mt-0.5" size={14} />
                  <div>
                    <span className="font-bold uppercase block">
                      LINK_REGISTRATION_FAILURE:
                    </span>
                    {linkError}
                  </div>
                </div>
              )}

              {linkSuccess && (
                <div className="border border-emerald-500 bg-emerald-500/5 p-3 flex gap-2 items-start text-emerald-500 font-mono text-[10px]">
                  <CheckCircle className="shrink-0 mt-0.5" size={14} />
                  <div>
                    <span className="font-bold uppercase block">
                      LINK_REGISTERED:
                    </span>
                    Routing link variables updated successfully in DB.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel>
                    <FieldTitle>Link Label</FieldTitle>
                    <FieldDescription>
                      Visual link button title
                    </FieldDescription>
                  </FieldLabel>
                  <FieldContent>
                    <input
                      type="text"
                      className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs uppercase"
                      placeholder="e.g. VIEW PORTFOLIO //"
                      {...registerLink("label")}
                    />
                    <FieldError
                      errors={linkErrors.label ? [linkErrors.label] : undefined}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    <FieldTitle>Target URL Route</FieldTitle>
                    <FieldDescription>
                      Target URL page location path
                    </FieldDescription>
                  </FieldLabel>
                  <FieldContent>
                    <input
                      type="text"
                      className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                      placeholder="e.g. /archive"
                      {...registerLink("url")}
                    />
                    <FieldError
                      errors={linkErrors.url ? [linkErrors.url] : undefined}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>
                    <FieldTitle>Description</FieldTitle>
                    <FieldDescription>
                      Short subtext caption under button
                    </FieldDescription>
                  </FieldLabel>
                  <FieldContent>
                    <input
                      type="text"
                      className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs normal-case"
                      placeholder="e.g. Primary full-stack showcase."
                      {...registerLink("desc")}
                    />
                    <FieldError
                      errors={linkErrors.desc ? [linkErrors.desc] : undefined}
                    />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel className="flex-row items-center gap-3 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        className="size-4 bg-background border-2 border-foreground focus:ring-0 accent-accent cursor-pointer"
                        {...registerLink("isExternal")}
                      />
                      <div>
                        <FieldTitle>External link</FieldTitle>
                        <FieldDescription>Open in new tab</FieldDescription>
                      </div>
                    </FieldLabel>
                  </Field>

                  <Field>
                    <FieldLabel>
                      <FieldTitle>Order Index</FieldTitle>
                      <FieldDescription>Sorting index order</FieldDescription>
                    </FieldLabel>
                    <FieldContent>
                      <input
                        type="number"
                        className="bg-background border-2 border-foreground p-3 focus:border-accent focus:outline-none font-mono text-xs"
                        {...registerLink("order")}
                      />
                      <FieldError
                        errors={
                          linkErrors.order ? [linkErrors.order] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                </div>
              </div>

              <div className="flex gap-3 justify-end border-t border-border/20 pt-4">
                {editingLink && (
                  <button
                    type="button"
                    onClick={handleCancelLinkEdit}
                    className="font-mono text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2"
                  >
                    Cancel
                  </button>
                )}

                <PixelButton
                  type="submit"
                  disabled={linkSubmitting}
                  className="border-accent text-accent py-2 px-5 text-[10px]"
                >
                  {editingLink ? (
                    <>
                      <Save size={12} className="mr-1.5" /> RECOMPILE_LINK
                    </>
                  ) : (
                    <>
                      <Plus size={12} className="mr-1.5" /> REGISTER_LINK
                    </>
                  )}
                </PixelButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (Radix Dialog) */}
      <Dialog
        open={!!deletingLink}
        onOpenChange={(open) => !open && setDeletingLink(null)}
      >
        <DialogContent className="border-2 border-foreground bg-background shadow-[6px_6px_0px_var(--color-destructive)] p-6">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={18} className="animate-bounce" /> WARNING:
              DESTRUCTIVE_ACTION
            </DialogTitle>
            <DialogDescription className="font-mono text-xs leading-normal">
              You are instructing the compiler to delete the BioLink routing
              configuration for{" "}
              <strong className="text-foreground font-black uppercase">
                [{deletingLink?.label}]
              </strong>{" "}
              from the schema. This link will no longer appear on your public
              BioProfile links page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button
              type="button"
              onClick={() => setDeletingLink(null)}
              className="font-mono text-xs uppercase font-bold text-muted-foreground hover:text-foreground border border-border/30 px-4 py-2"
            >
              Cancel Operation
            </button>
            <button
              type="button"
              disabled={linkSubmitting}
              onClick={handleLinkDeleteConfirm}
              className="font-mono text-xs uppercase font-bold bg-destructive text-white border border-destructive hover:bg-transparent hover:text-destructive px-5 py-2 transition-all cursor-crosshair disabled:opacity-50"
            >
              Confirm Deletion
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
