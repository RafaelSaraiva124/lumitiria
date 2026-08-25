"use client";

import { useActionState, type CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  sendQuoteRequest,
  type QuoteRequestState,
} from "@/lib/actions/quote";

const initialQuoteRequestState: QuoteRequestState = {
  status: "idle",
  message: "",
};

export default function Cta() {
  const [state, formAction, pending] = useActionState(
    sendQuoteRequest,
    initialQuoteRequestState
  );

  return (
    <section
      id="orcamento"
      className="bg-background py-24 md:py-32"
      style={
        {
          "--background": "#1c2620",
          "--foreground": "#f5f3ee",
          "--muted-foreground": "#9fae9f",
          "--border": "rgba(245, 243, 238, 0.14)",
          "--input": "rgba(245, 243, 238, 0.15)",
          "--primary": "#f5f3ee",
          "--primary-foreground": "#1c2620",
          "--ring": "#9fae9f",
        } as CSSProperties
      }
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12">
        <div>
          <Badge
            variant="outline"
            className="mb-6 border-border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Pedir orçamento
          </Badge>

          <h2 className="font-[family-name:var(--font-fraunces)] text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-5xl">
            Vamos dar forma ao teu próximo projeto.
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Conta-nos o que precisas — caixilharia, vidro, fachadas ou
            estores — e a nossa equipa entra em contacto contigo para
            avançar com um orçamento.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-foreground">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="text-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-foreground">
              Telefone (opcional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="text-foreground"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="text-foreground">
              Mensagem
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Descreve o teu projeto..."
              required
              className="text-foreground"
            />
          </div>

          <Button type="submit" size="lg" disabled={pending} className="mt-2">
            {pending ? "A enviar..." : "Pedir orçamento"}
          </Button>

          {state.status !== "idle" && (
            <p
              role="status"
              aria-live="polite"
              className={
                state.status === "success"
                  ? "text-sm text-foreground"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
