"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LoginFormValues, loginSchema } from "@/lib/validation/auth";

export function LoginForm() {
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field === "email" || field === "password") {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      const response = await login(parsed.data);
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input type="email" placeholder="Email" {...register("email")} />
      {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}

      <Input type="password" placeholder="Password" {...register("password")} />
      {errors.password ? (
        <p className="text-xs text-destructive">{errors.password.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        Login
      </Button>
    </form>
  );
}
