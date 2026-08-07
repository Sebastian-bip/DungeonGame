# AGENTS.md

## Project Overview

This is a Next.js application using:

- Next.js
- TypeScript
- React
- Tailwind CSS
- ESLint

Use the App Router.

## Project Structure

- `src/app/` - pages, layouts and routes
- `src/components/` - reusable React components
- `src/lib/` - utilities and shared logic
- `src/types/` - shared TypeScript types
- `public/` - static assets

## General Rules

- Use TypeScript instead of JavaScript.
- Do not use `any` unless absolutely necessary.
- Prefer small, reusable components.
- Keep business logic outside UI components when possible.
- Do not duplicate code when it can be extracted into a reusable function or component.
- Follow the existing project structure before creating new folders.
- Do not modify configuration files unless necessary.

## React / Next.js

- Use Server Components by default.
- Add `"use client"` only when client-side functionality is required.
- Use Next.js `Link` for internal navigation.
- Use `next/image` for local images whenever appropriate.
- Keep components focused on a single responsibility.

## TypeScript

- Prefer explicit types for function parameters and return values when useful.
- Use interfaces or type aliases consistently with the existing codebase.
- Avoid `any`.
- Do not suppress TypeScript errors with `@ts-ignore` unless there is a documented reason.

## Tailwind CSS

- Use Tailwind classes for styling.
- Follow the existing design system and spacing conventions.
- Avoid inline styles unless there is a specific reason.
- Reuse existing components instead of creating slightly different copies.

## Before Making Changes

1. Inspect the existing implementation.
2. Understand how the affected code is structured.
3. Reuse existing utilities and components where possible.
4. Make the smallest change necessary.



## After Making Changes

Run:

```bash
npm run lint
npm run build