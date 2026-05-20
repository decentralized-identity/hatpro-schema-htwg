# HATPro Markdown Guide

**Status:** Draft  
**Project:** HATPro  
**Audience:** Developers, architects, contributors, technical writers  
**Last Updated:** 2026-05-06  

---

# Table of Contents

<!-- toc -->

- [1. Purpose](#1-purpose)
- [2. Markdown Standards](#2-markdown-standards)
  * [2.1 Primary Markdown Target](#21-primary-markdown-target)
  * [2.2 Markdown File Extension](#22-markdown-file-extension)
  * [2.3 Markdown Heading Standards](#23-markdown-heading-standards)
  * [2.4 Recommended Heading Practices](#24-recommended-heading-practices)
- [3. Markdown Filename Standards](#3-markdown-filename-standards)
  * [3.1 Recommended Filename Format](#31-recommended-filename-format)
  * [3.2 Avoid Spaces in Filenames](#32-avoid-spaces-in-filenames)
  * [3.3 Avoid Special Characters in Filenames](#33-avoid-special-characters-in-filenames)
  * [3.4 Underscore Guidance](#34-underscore-guidance)
  * [3.5 Recommended Filename Rules](#35-recommended-filename-rules)
- [4. Table of Contents (TOC) Standards](#4-table-of-contents-toc-standards)
  * [4.1 TOC Requirement Guidance](#41-toc-requirement-guidance)
  * [4.2 TOC Marker Standard](#42-toc-marker-standard)
  * [4.3 GitHub Heading Links](#43-github-heading-links)
- [5. TOC Automation Tooling](#5-toc-automation-tooling)
  * [5.1 Recommended TOC Tool](#51-recommended-toc-tool)
  * [5.2 Install markdown-toc](#52-install-markdown-toc)
  * [5.3 Generate or Update TOC](#53-generate-or-update-toc)
  * [5.4 Cross-Platform Compatibility](#54-cross-platform-compatibility)
  * [5.5 Recommended Workflow](#55-recommended-workflow)
- [6. Recommended Markdown Document Structure](#6-recommended-markdown-document-structure)
  * [6.1 Suggested Structure](#61-suggested-structure)
  * [6.2 Metadata Block](#62-metadata-block)
- [7. Markdown Code Block Standards](#7-markdown-code-block-standards)
  * [7.1 Use Fenced Code Blocks](#71-use-fenced-code-blocks)

<!-- tocstop -->

---

# 1. Purpose

This document defines the Markdown standards, conventions, tooling, and filename practices used within the HATPro project.

The goals are to:

- Ensure GitHub-compatible Markdown rendering
- Improve cross-platform compatibility
- Simplify documentation maintenance
- Standardize document structure
- Reduce tooling and scripting issues
- Support automated Table of Contents generation
- Improve long-term documentation consistency

---

# 2. Markdown Standards

## 2.1 Primary Markdown Target

All HATPro Markdown documents should render correctly in:

- GitHub
- VS Code Markdown Preview
- Common Markdown viewers
- Static documentation systems

GitHub Markdown compatibility is considered the primary target.

---

## 2.2 Markdown File Extension

Standard extension:

```text
.md
```

Examples:

```text
cross-platform-tooling-guide.md
markdown-guide.md
json-schema-generation-guide.md
```

---

## 2.3 Markdown Heading Standards

Use standard Markdown headings:

```markdown
# Level 1
## Level 2
### Level 3
#### Level 4
```

Avoid skipping heading levels unnecessarily.

---

## 2.4 Recommended Heading Practices

Recommended:

- Short headings
- Consistent terminology
- Numeric sectioning for large technical documents

Example:

```markdown
# 1. Purpose
# 2. Standards
# 3. Tooling
```

---

# 3. Markdown Filename Standards

## 3.1 Recommended Filename Format

Use:

```text
lowercase-with-hyphens.md
```

Example:

```text
cross-platform-tooling-guide.md
markdown-guide.md
travel-profile-query-model.md
```

---

## 3.2 Avoid Spaces in Filenames

Do NOT use spaces in Markdown filenames.

Avoid:

```text
Cross Platform Tooling Guide.md
```

Prefer:

```text
cross-platform-tooling-guide.md
```

Reasons:

- Simpler command-line usage
- Better URL compatibility
- Reduced quoting/escaping issues
- Better cross-platform scripting compatibility

---

## 3.3 Avoid Special Characters in Filenames

Avoid the following characters in Markdown filenames:

```text
(space)
&
+
#
%
?
!
*
'
"
(
)
[
]
{
}
|
\
/
:
;
<
>
,
=
@
$
^
~
`
```

These characters can cause problems with:

- shell commands
- URLs
- Markdown rendering
- GitHub links
- CI/CD pipelines
- static site generators
- scripting tools

---

## 3.4 Underscore Guidance

Underscores (`_`) are technically supported but are discouraged.

Prefer:

```text
cross-platform-tooling-guide.md
```

instead of:

```text
cross_platform_tooling_guide.md
```

Reasons:

- Better readability
- Better URL consistency
- Better compatibility with tooling ecosystems
- More common modern convention

---

## 3.5 Recommended Filename Rules

Preferred:

- lowercase
- hyphen-separated words
- short but descriptive names

Avoid:

- mixed case
- spaces
- special characters
- excessive filename length

---

# 4. Table of Contents (TOC) Standards

## 4.1 TOC Requirement Guidance

A Table of Contents is recommended for:

- large technical documents
- standards documents
- architecture documents
- implementation guides
- governance documentation

---

## 4.2 TOC Marker Standard

Use the following markers:

```markdown
<!-- toc -->

<!-- tocstop -->
```

Example:

4.6

```markdown
# Table of Contents

<!-- toc -->

<!-- tocstop -->
```

The TOC generator inserts content between these markers.

---

## 4.3 GitHub Heading Links

GitHub automatically generates heading anchors.

Example:

```markdown
# 1. Purpose
```

Automatically becomes:

```text
#1-purpose
```

This allows clickable Table of Contents links.

---

# 5. TOC Automation Tooling

## 5.1 Recommended TOC Tool

Recommended npm package:

```text
markdown-toc
```

Package:

```text
https://www.npmjs.com/package/markdown-toc
```

---

## 5.2 Install markdown-toc

Run from the repository root:

```bash
npm install --save-dev markdown-toc
```

This installs the TOC generator as a development dependency.

---

## 5.3 Generate or Update TOC

Example command:

```bash
npx markdown-toc -i docs/markdown-guide.md
```

Example for another document:

```bash
npx markdown-toc -i docs/cross-platform-tooling-guide.md
```

The `-i` option updates the file in place.

---

## 5.4 Cross-Platform Compatibility

The following commands work in:

- Windows cmd.exe
- PowerShell
- Git Bash
- macOS Terminal
- Linux Bash

Examples:

```bash
npm install --save-dev markdown-toc
```

```bash
npx markdown-toc -i docs/markdown-guide.md
```

Git Bash is NOT required.

---

## 5.5 Recommended Workflow

Recommended process:

1. Create or update Markdown headings
2. Run TOC update command
3. Review generated TOC
4. Commit updated document

---

# 6. Recommended Markdown Document Structure

## 6.1 Suggested Structure

Example:

```markdown
# Document Title

Metadata

---

# Table of Contents

<!-- toc -->

- [1. Purpose](#1-purpose)
- [2. Scope](#2-scope)
- [3. Standards](#3-standards)
- [7. Markdown Code Block Standards](#7-markdown-code-block-standards)
  * [7.1 Use Fenced Code Blocks](#71-use-fenced-code-blocks)

<!-- tocstop -->

---

# 1. Purpose

# 2. Scope

# 3. Standards
```

---

## 6.2 Metadata Block

Recommended metadata:

```markdown
**Status:** Draft  
**Project:** HATPro  
**Audience:** Developers  
**Last Updated:** YYYY-MM-DD
```

---

# 7. Markdown Code Block Standards

## 7.1 Use Fenced Code Blocks

Preferred:

````markdown
```bash
npm install
```