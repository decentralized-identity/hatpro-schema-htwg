# HATPro GitHub/Version Control Requirements

## Segment or Sub-Segment - Independent Versioning

The nature of Hospitality and Travel (and the Travel Profile/HATPro project) is that it is a natural tree structure, with a single root, segments, and segment specializations that will evolve independently. This means that having a monolithic/single Travel Profile schema with a single update schedule is likely unworkable. 

While the top of the model (TravelProfile class) will likely change slowly over time, the major components (segments) and sub-components (segment specialization) need a mechanism to manage versions independently.

This is both a human process and a GitHub/version control challenge. How would this be structured in a single or multiple Git repositories?

## Conversation

You are describing a classic “platform + independently evolving modules” problem. In standards terms: a stable *root contract* (TravelProfile) that composes a set of *segment contracts* (Identity, Contact, Preferences, Support, etc.), where each segment is owned and versioned independently, yet still needs an “overall profile release” story for implementers.

Below is a practical structure that works in GitHub with JSON Schema and `$ref` composition, and scales to multiple teams.

## Guiding principles

1. **Separate “interface stability” from “implementation churn”.**
    TravelProfile should be mostly composition glue: references to segments, high-level governance, and compatibility constraints. Segments carry the evolving detail.
2. **Segments must be versioned and released independently.**
    Consumers should be able to adopt `contact@1.4.0` without being forced to take `preferences@2.0.0`.
3. **You still need a “known-good bundle” for adoption.**
    Even if you avoid a monolith, implementers need a tested set of versions that work together (a “bill of materials” / release train).
4. **Prefer immutable refs for published artifacts.**
    In other words: once `contact@1.4.0` is released, its schema files should be immutable at that version. Fixes roll forward.

## Option A (recommended): Multi-repo segments + one “profile aggregator” repo

### Repositories

- **Repo 1: `hatpro-travelprofile` (Aggregator / Root)**
  - Owns the `TravelProfile` root schema and the *composition rules*.
  - Publishes “bundles” (tested combinations of segment versions).
  - CI validates the full assembled profile using pinned segment versions.
- **Repo N: `hatpro-segment-contact`, `hatpro-segment-identity`, etc.**
  - Each segment owns its own schemas, examples, enums, templates, and tests.
  - Each segment has its own cadence, maintainers, issues, PRs, releases.

### Versioning model

- **Each segment repo uses SemVer** (`MAJOR.MINOR.PATCH`).
  - **MAJOR**: breaking change to schema contract (e.g., rename fields, change requiredness, change types).
  - **MINOR**: backward-compatible additions (new optional properties, new enum values if allowed).
  - **PATCH**: backward-compatible fixes (doc, tighter descriptions, bug fixes that don’t break validation).
- **Aggregator repo also uses SemVer**, but its meaning is different:
  - It primarily versions the **bundle** and/or root composition rules.
  - Example: `travelprofile@1.3.0` might mean: root schema v1.3.0 + pinned segments list.

### How composition works

- Segment schemas are published as **package artifacts** (npm, Maven-style, or GitHub Releases zip), and referenced locally at build time.
- The aggregator repo has a **lockfile-like manifest** that pins exact segment versions, e.g.:

```
# hatpro.lock.yaml
segments:
  identity: 1.2.0
  contact: 1.4.1
  preferences: 0.9.0
  support: 2.0.0
```

CI pipeline in the aggregator:

1. Fetch those segment artifacts.
2. Assemble into a local registry (or vendor folder).
3. Run AJV validation across:
   - root schema
   - segment schemas
   - cross-segment integration examples
4. Publish the assembled “bundle” as a release artifact.

### Pros / cons

- Pros: clean ownership, independent cadences, clearer issue routing, strong modularity.
- Cons: needs tooling for “bundle assembly” and a version manifest discipline.

This option is the best match for “segments evolve independently” and “root evolves slowly”.

## Option B: Single repo “monorepo” with workspace packages per segment

If you want the operational simplicity of one repo (single Issues, single PR search, one CI pipeline), you can still get independent versioning *per segment* by treating each segment as a package.

### Repository layout (monorepo)

```
/packages
  /core
  /travelprofile-root
  /segment-identity
  /segment-contact
  /segment-preferences
  /segment-support
/tools
```

Each segment has:

- `package.json` (or equivalent metadata)
- `json/schemas/...`
- `json/examples/...`
- tests

### Release model

- Use a **multi-package release tool** (changesets-style approach) so `segment-contact` can release `1.4.1` while `segment-support` stays at `2.0.0`.
- Still maintain an optional “bundle” package `travelprofile-bundle` that pins dependencies.

### Pros / cons

- Pros: simplest cross-module refactoring, easiest shared tooling, one CI.
- Cons: social coupling risk (“drive-by edits” across segments), governance needs stronger CODEOWNERS boundaries.

This is often a strong fit if your working group expects frequent cross-cutting changes early on, and you want to split into multi-repo later.

## Option C: Two-tier repos (Core libraries separate, segments separate, plus aggregator)

This is a refinement of Option A:

- **`hatpro-core`**: shared primitives (InternationalString, Address base patterns, common enums, validation tooling).
- **`hatpro-segment-\*`**: depends on `hatpro-core`.
- **`hatpro-travelprofile`**: depends on segments (and sometimes core).

This is helpful when many segments depend on the same “library components” and you want those governed tightly.

## Handling `$ref` across repos/packages

The key operational decision is: *what kind of `$ref` do you allow in published schemas?*

In practice, you want:

- **During development:** relative `$ref` within a repo/package (easy local work).
- **For published artifacts:** resolvable refs in consumer environments.

Two workable patterns:

1. **Bundle-time rewriting:** keep refs relative inside packages, and your build step assembles them into a single resolvable registry (what you’re already doing with schema registries).
2. **Canonical ID-based refs:** assign each schema an `$id` that includes package + version, and reference by `$id`. This is clean but requires more discipline and an artifact hosting strategy.

Given your existing AJV registry approach, bundle-time assembly plus an explicit manifest is usually the quickest path.

## GitHub governance mechanics

Regardless of repo strategy, these controls matter:

- **CODEOWNERS per segment** (mandatory for approvals).
- **Protected branches + required status checks** (schema validation, example validation, ref resolution).
- **A compatibility policy document** per segment:
  - what constitutes breaking change
  - whether additionalProperties is allowed
  - enum extension policy
- **Deprecation workflow**:
  - deprecate fields (document + keep validating)
  - remove only in next MAJOR

## Release trains: independent versions plus “known-good sets”

To avoid implementers suffering dependency hell:

- Segments release whenever ready.
- Aggregator periodically publishes:
  - `bundle-2025.01` (calendar version) or `travelprofile@1.3.0` (SemVer)
  - includes the pinned segment versions and test results

This gives you both:

- “independent evolution”
- “easy adoption path”

## Practical recommendation for HATPro

Given your stated constraints (tree structure, independent evolution, and a standards-group workflow), I would implement:

1. **Monorepo now (Option B)** while the model is still moving and tooling is actively evolving.
2. Enforce **strong boundaries** with CODEOWNERS and per-package versioning.
3. Add an explicit **bundle package + lock manifest** so you can publish tested sets.
4. If/when segments gain truly independent teams and cadence, split into **multi-repo (Option A)** without changing the consumer experience (because consumers already depend on packages and bundles, not your repo layout).

If you want, I can sketch a concrete folder structure and the exact CI jobs (segment-level validation + bundle-level integration validation) aligned to your current `gen:templates` / AJV registry approach, including how to implement the “hatpro.lock” manifest and bundle assembly.

Yes to a folder structure. Question, the current working repo is already geared around packages, what is the core aspect that would differ other than providing codeowners at a folder level vs. the entire repo?

### What would actually differ (core aspects), beyond CODEOWNERS?

If your repo is already “packages-first,” the key differences are less about layout and more about **governance, release semantics, and dependency pinning**. In practice, you move from “one repo = one product” to “one repo = many independently released products.”

The material deltas are:

1. **Independent versioning per package (not one repo version)**
   - Each segment package (e.g., `contact`, `preferences`) has its own SemVer lifecycle.
   - Breaking changes in `contact` do not force a repo-wide major bump.
2. **A bundle / BOM concept becomes first-class**
   - You add an explicit **TravelProfile bundle** (or “root package”) that pins a tested set of segment versions (like a bill of materials).
   - This is what implementers consume for “known-good compatibility,” even though segments remain independently released.
3. **Dependency constraints + lock/pin discipline**
   - Segments depend on `core` (and maybe shared libs) using version ranges, but the bundle pins exact versions.
   - CI must validate:
     - segment in isolation (unit validation)
     - bundle assembly (integration validation)
   - This is the structural mechanism that makes “independent evolution” not devolve into incompatibility.
4. **Release automation changes**
   - You introduce multi-package release tooling (or equivalent conventions) so changes to `packages/contact` can produce `contact@1.4.1` without cutting releases for everything else.
   - Your changelog strategy becomes per-package, not a single repo changelog.
5. **Public contract boundaries become explicit**
   - Each segment gets a clear “public API surface”: stable `$id`/entry schema(s), compatibility policy, and deprecation rules.
   - This is more important than the folder structure itself.

CODEOWNERS is necessary, but it only enforces review; it does not solve version independence, compatibility, or bundling.

------

## Proposed folder structure (monorepo with independent packages + bundle)

This is consistent with what you described (already geared around packages), but makes the bundle/BOM and package boundaries explicit.

```
/packages
  /core
    /json
      /schemas
      /enums
      /examples
      /templates
    package.json
    CHANGELOG.md
    README.md

  /travelprofile-root                # root contract + bundle definition
    /json
      /schemas
        TravelProfile.schema.json    # mostly composition refs
      /examples
      /tests                         # integration examples (cross-segment)
    /manifests
      hatpro.lock.yaml               # pinned segment versions for bundle builds
      compatibility-matrix.md
    package.json
    CHANGELOG.md
    README.md

  /identity
    /json
      /schemas
      /examples
      /templates
      /tests
    package.json
    CHANGELOG.md
    README.md

  /contact
    (same pattern)

  /preferences
    (same pattern)

  /support
    (same pattern)

/tools
  /schema-registry                   # your existing registry logic / resolvers
  /build-bundle                       # fetch/assemble/pin segments
  /validate
    validate-with-ajv.mjs
    validate-examples.mjs
  /release
    versioning, tagging, changelog tooling

/.github
  /workflows
    segment-ci.yml                   # per-package validation
    bundle-ci.yml                    # assemble pinned set + integration validate
  CODEOWNERS

/CONTRIBUTING.md
/GOVERNANCE.md
```

### Notes on intent

- **`packages/travelprofile-root`** is the “product” that represents the root schema + *a tested set* of segments. It’s effectively your “distribution.”
- Each segment package is a **unit of independent release**.
- `core` is a dependency of segments (and potentially of root).

------

## How to use CODEOWNERS effectively in this model

Instead of “whole repo ownership,” do this:

```
/packages/contact/          @contact-maintainers
/packages/identity/         @identity-maintainers
/packages/preferences/      @preferences-maintainers
/packages/support/          @support-maintainers
/packages/core/             @core-maintainers
/packages/travelprofile-root/ @architecture-maintainers
/tools/                     @tooling-maintainers
/.github/                   @architecture-maintainers
/GOVERNANCE.md              @architecture-maintainers
```

That enforces boundary discipline, but again: the real win comes from independent releases + bundle pinning.

------

## The “bundle/BOM” mechanism in a monorepo

Even in a single repo, treat the bundle as if it were assembling external packages:

- `hatpro.lock.yaml` in `travelprofile-root` pins versions of `identity`, `contact`, etc.
- CI for `travelprofile-root` validates that those exact versions assemble cleanly and examples validate.

This gives you a clean future path:

- If later you split segments to separate repos, the bundle process doesn’t change much—only the “fetch segment artifacts” step changes.

------

## Minimal delta list (what you’d implement first)

If you already have `/packages/*`:

1. Add **`packages/travelprofile-root`** (if it doesn’t already exist as a distinct “bundle/root”).
2. Add **per-package CHANGELOG + per-package versioning rules**.
3. Add **bundle lockfile** (even if initially it points to “workspace” versions).
4. Split CI into:
   - per-segment validation
   - bundle/integration validation
5. Add **CODEOWNERS per package**.

That’s the smallest set of changes that materially enables independent evolution.

------

If you paste your current top-level repo tree (just `dir /b` or `tree /f` of the root and `packages`), I can map this structure onto what you already have, naming things to match your conventions (`json/schemas`, `json/templates`, etc.) and aligning with your existing `gen:templates` and AJV validation scripts.

That suggests that versions can exist such that there is a overall schema version (Travel Profile) and then compatible versions of segments and segments (with their own version compatibility controls) which can be snapped into a Travel Profile for Mary in such a manner that relying parties that can support multiple versions can map the overall travel profile version and segment/sub-segment versions in a reliable manner

Yes—conceptually and operationally you end up with a **versioned root contract** plus **versioned segment contracts**, and an explicit mechanism that states, “This TravelProfile version is composed of these segment versions.” Relying parties can then (a) validate what they received, and (b) decide whether they can process it natively, transform it, or reject it.

The critical design point is: **you must make the version metadata explicit and machine-readable**, not implicit in Git tags or folder names.

## 1) The model you want: Root version + segment versions + compatibility contract

### A. Root (TravelProfile) version

- Describes the *envelope* and composition rules.
- Changes slowly.
- Tells verifiers what “shape” the overall tree has at the top level.

### B. Segment versions (and sub-segment versions)

- Each segment is independently SemVer’d.
- A segment version communicates breaking vs additive changes within that segment boundary.

### C. A “bundle/BOM” (Bill of Materials)

- A BOM is the authoritative statement of **which segment versions constitute a tested-compatible set** for a given TravelProfile bundle release.
- This is what you “snap into” a TravelProfile instance for Mary.

In other words: *Mary’s TravelProfile instance is not just data; it is data + a declared contract set.*

## 2) What relying parties need to reliably map versions

A relying party that supports multiple versions needs at least three machine-readable signals:

1. **Root schema identifier and version**
   - E.g., a root `$id` (or canonical schema URI) that implies version, or explicit `schemaVersion`.
2. **Per-segment identifiers and versions**
   - For each included segment: `segmentId`, `segmentVersion` (SemVer), ideally also its schema `$id`.
3. **Optional BOM identifier**
   - If you publish “known-good bundles,” include a `bundleId` / `bundleVersion` so the RP can quickly recognize a tested set.

With that, an RP can implement:

- direct support matrix (accept/parse)
- transformation rules (map older → newer, or vice versa)
- policy rules (e.g., “I accept Contact >=1.3 <2.0”)

## 3) A concrete pattern for the instance (Mary’s profile)

You do **not** want “version by inference.” Put it in the instance metadata, e.g. a `meta` or `profileDescriptor` block:

```
{
  "meta": {
    "root": {
      "schemaId": "https://schemas.hatpro.org/travelprofile/root/1.3.0",
      "version": "1.3.0"
    },
    "bundle": {
      "id": "https://schemas.hatpro.org/travelprofile/bundles/2025.01",
      "version": "2025.01"
    },
    "segments": [
      {
        "name": "contact",
        "schemaId": "https://schemas.hatpro.org/segments/contact/1.4.1",
        "version": "1.4.1"
      },
      {
        "name": "preferences",
        "schemaId": "https://schemas.hatpro.org/segments/preferences/0.9.0",
        "version": "0.9.0"
      }
    ]
  },
  "contact": { "...": "..." },
  "preferences": { "...": "..." }
}
```

Key points:

- **Root version is explicit**
- **Segment versions are explicit**
- **Bundle is optional but very useful** (because it says “this set has been integration-tested as a unit”)

If you dislike embedding URIs, you can keep them as compact identifiers, but you need something canonical.

## 4) How compatibility controls work in practice

### Segment-level compatibility

- A segment is responsible for its own SemVer discipline.
- The segment publishes:
  - supported prior versions (if it provides transforms)
  - migration notes
  - deprecation schedule

### Root-level compatibility

- Root primarily governs:
  - how segments are included / referenced
  - required segments vs optional segments
  - cross-segment invariants (if any)

### Bundle-level compatibility (“snap-in”)

- A bundle is a compatibility snapshot:
  - root version X
  - segment versions A, B, C
  - verified to work together

This is what allows “Mary’s profile” to be assembled with confidence, and lets RPs quickly recognize a known set.

## 5) How RPs that support multiple versions can map reliably

An RP can implement a deterministic flow:

1. Read `meta.root.version`
2. For each segment in `meta.segments`, read `segment.version`
3. Consult:
   - a local support matrix: “I support contact 1.x; preferences 0.9–1.2; root 1.3+”
   - optionally bundle recognition: “I support bundle 2025.01 exactly”
4. Choose:
   - parse natively
   - transform segment(s) to internal canonical model
   - request a different presentation (if your protocol supports negotiation)
   - reject with a clear error describing which segment/version is unsupported

This yields reliable behavior even when different RPs are at different upgrade stages.

## 6) The GitHub/repo implication (tying back to your earlier point)

To make this real, your repos (or packages) must publish three artifact types:

1. **Segment packages** (schemas + examples + changelog) versioned independently.
2. **Root package** (TravelProfile composition schema) versioned independently.
3. **Bundle/BOM artifacts** (a manifest file + optionally an assembled schema registry) versioned as “tested sets.”

In a monorepo, the BOM is still essential; it is the bridge between “independent evolution” and “integrated consumption.”



