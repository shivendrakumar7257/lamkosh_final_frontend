import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2, Lock, Shield, User as UserIcon } from "lucide-react";
import { updateProfileSchema, UpdateProfileFormData } from "@/lib/validation/auth";
import { useAuthStore, Gender } from "@/lib/auth-store";
import { api, getErrorMessage, CustomAxiosError } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import { Reveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/profile")({
  head: () => ({
    meta: [
      { title: "Account Profile — LaMoksh Fabrics" },
      {
        name: "description",
        content: "Manage your personal profile, addresses, and atelier preferences.",
      },
    ],
  }),
  component: ProfilePageWrapper,
});

function ProfilePageWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function ProfilePage() {
  const { user, updateUserProfile, logout } = useAuthStore();
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      address: user?.address || "",
      gender: (user?.gender as Gender) || "PREFER_NOT_TO_SAY",
    },
  });

  // Fetch fresh profile on mount via GET /profile
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setIsFetchingProfile(true);
      try {
        const res = await api.get("/profile");
        const profileData = res.data?.data || res.data;
        if (mounted && profileData) {
          reset({
            name: profileData.name || user?.name || "",
            address: profileData.address || user?.address || "",
            gender:
              (profileData.gender as Gender) || (user?.gender as Gender) || "PREFER_NOT_TO_SAY",
          });
        }
      } catch (err) {
        // Fallback to user from store
        if (user && mounted) {
          reset({
            name: user.name || "",
            address: user.address || "",
            gender: (user.gender as Gender) || "PREFER_NOT_TO_SAY",
          });
        }
      } finally {
        if (mounted) setIsFetchingProfile(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setServerError(null);
    try {
      await updateUserProfile({
        name: data.name.trim(),
        address: data.address?.trim() || "",
        gender: data.gender,
      });
      toast.success("Profile updated successfully.");
      reset(data); // reset dirty state
    } catch (err) {
      const customErr = err as CustomAxiosError;
      if (customErr.response?.status === 422 && customErr.validationErrors) {
        Object.entries(customErr.validationErrors).forEach(([field, msg]) => {
          if (["name", "address", "gender"].includes(field)) {
            setError(field as any, { message: msg });
          }
        });
      }

      const msg = getErrorMessage(err, "Failed to update profile. Please try again.");
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="container-lux py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          {/* Header & Tabs */}
          <div className="border-b border-border pb-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="eyebrow text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  LA MOKSH ATELIER ACCOUNT
                </p>
                <h1 className="mt-2 font-serif text-3xl font-normal md:text-4xl text-foreground">
                  Welcome, {user?.name || "Patron"}
                </h1>
                <p className="body-lux mt-2 text-sm text-muted-foreground">
                  Manage your personal details, shipping addresses, and security credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-red-700"
              >
                Sign Out
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-8 flex gap-8 border-b border-border/60">
              <Link
                to="/account/profile"
                className="border-b-2 border-espresso pb-3 text-xs font-semibold uppercase tracking-wider text-espresso"
              >
                Personal Profile
              </Link>
              <Link
                to="/account/orders"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Orders
              </Link>
              <Link
                to="/account/reviews"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                My Reviews
              </Link>
              <Link
                to="/account/security"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Security & Password
              </Link>
              <Link
                to="/wishlist"
                className="border-b-2 border-transparent pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                Saved Wishlist
              </Link>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {/* Left summary column */}
            <div className="space-y-6">
              <div className="rounded-sm border border-border/80 bg-champagne p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-ivory">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-medium">{user?.name}</h2>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Member Role:</span>
                    <span className="font-medium text-foreground uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <span className="font-mono text-foreground">{user?.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-border/80 bg-background p-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 font-medium uppercase tracking-wider text-foreground">
                  <Shield className="h-4 w-4 text-espresso" />
                  <span>Privacy Guarantee</span>
                </div>
                <p className="mt-2 leading-relaxed">
                  Your identity and measurements remain strictly confidential within the LaMoksh
                  atelier.
                </p>
                <div className="mt-4">
                  <Link
                    to="/account/security"
                    className="inline-flex items-center gap-1.5 text-xs text-espresso font-medium hover:underline"
                  >
                    <Lock className="h-3 w-3" /> Change security password &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Right form column */}
            <div className="md:col-span-2">
              <div className="rounded-sm border border-border/80 bg-background p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-normal text-foreground">
                  Edit Profile Information
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update your contact name, gender preference, and default shipping destination.
                </p>

                {serverError && (
                  <div className="mt-4 rounded-[2px] border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {serverError}
                  </div>
                )}

                {isFetchingProfile ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-espresso" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                    {/* FULL NAME */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="profile-name"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        Full Name
                      </label>
                      <input
                        id="profile-name"
                        type="text"
                        {...register("name")}
                        className={cn(
                          "h-11 w-full rounded-[2px] border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-espresso",
                          errors.name && "border-red-400 focus:border-red-400",
                        )}
                      />
                      {errors.name ? (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                      ) : null}
                    </div>

                    {/* EMAIL (Read-only) */}
                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Email Address (Primary Login)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="h-11 w-full rounded-[2px] border border-border/50 bg-muted/30 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-[0.7rem] text-muted-foreground">
                        Contact support to modify primary email.
                      </p>
                    </div>

                    {/* MOBILE (Read-only) */}
                    <div className="space-y-1.5">
                      <label className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.mobile || ""}
                        className="h-11 w-full rounded-[2px] border border-border/50 bg-muted/30 px-3 py-2 text-sm font-mono text-muted-foreground cursor-not-allowed"
                      />
                    </div>

                    {/* GENDER */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="profile-gender"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        Gender
                      </label>
                      <select
                        id="profile-gender"
                        {...register("gender")}
                        className={cn(
                          "h-11 w-full rounded-[2px] border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-espresso",
                          errors.gender && "border-red-400 focus:border-red-400",
                        )}
                      >
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {errors.gender ? (
                        <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>
                      ) : null}
                    </div>

                    {/* DEFAULT SHIPPING ADDRESS */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="profile-address"
                        className="block text-[0.7rem] font-medium uppercase tracking-[0.15em] text-foreground"
                      >
                        Default Shipping Destination / Address
                      </label>
                      <textarea
                        id="profile-address"
                        rows={3}
                        placeholder="House / Flat No, Street, City, State, PIN Code"
                        {...register("address")}
                        className={cn(
                          "w-full rounded-[2px] border border-border bg-transparent p-3 text-sm outline-none transition-colors focus:border-espresso",
                          errors.address && "border-red-400 focus:border-red-400",
                        )}
                      />
                      {errors.address ? (
                        <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                      ) : null}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className="btn-lux flex h-11 items-center justify-center gap-2 px-8 text-xs disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...
                          </>
                        ) : (
                          "Save Profile Changes"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
