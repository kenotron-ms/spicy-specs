---
title: "Ruthless Simplicity"
slug: "ruthless-simplicity"
category: "philosophy"
spiceLevel: 3
tags: ["simplicity", "yagni", "less-is-more", "mvp"]
summary: "Build the simplest thing that could possibly work, then iterate. Complexity is a debt that compounds."
created: "2026-03-24"
updated: "2026-03-24"
author: "spicy-specs-team"
---

# Ruthless Simplicity

## Core Principle

Every line of code is a liability. Every abstraction is a bet on the future. Make the smallest bet that delivers value, then iterate with evidence.

## Invariants

1. **No speculative generality.** Don't build for requirements that don't exist yet.
2. **One way to do it.** If there are two ways to accomplish something, pick one and delete the other.
3. **Boring technology wins.** Choose the most boring tool that solves the problem.
4. **Delete before you add.** When adding a feature, first look for code to remove.
5. **Measure before you optimize.** Intuition about performance is usually wrong.

## Anti-Patterns to Avoid

- Building "flexible" systems before you have two concrete use cases
- Adding configuration options "just in case"
- Choosing a framework for features you might need someday
- Premature abstraction (DRY applied too early with too few examples)

## When to Apply

Always. This is the default stance. Deviate only with evidence that complexity is required, and document why.
