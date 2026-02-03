# Changelog Documentation Standards

This document establishes comprehensive guidelines for maintaining a structured, consistent, and professional `CHANGELOG.md` for the Eduvoka platform, adhering to [Keep a Changelog](https://keepachangelog.com/) principles with standardized conventions.

---

## 1. Objectives

* **Documentation**: Maintain a chronological record of all significant modifications across software versions.
* **Transparency**: Facilitate comprehension of changes for developers, stakeholders, and end-users.
* **Traceability**: Ensure comprehensive tracking and documentation of features, defect resolutions, and system updates.
* **Communication**: Provide clear release notes for deployment and migration planning.

---

## 2. File Specifications

* **Filename**: `CHANGELOG.md`
* **Location**: Project root directory
* **Format**: Markdown (.md)
* **Update Frequency**: Modified with each release cycle
* **Version Control**: Maintained under Git version control

---

## 3. Document Structure

### 3.1 Document Header

```markdown
# Changelog

All notable changes to the Eduvoka platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
```

### 3.2 Version Entry Format

Each version entry shall conform to the following structure:

```markdown
## [vX.Y.Z] - YYYY-MM-DD

### Added
- Description of newly implemented features and functionality.

### Changed
- Description of modifications to existing functionality.

### Deprecated
- Description of features marked for future removal.

### Removed
- Description of deleted features or deprecated functionality.

### Fixed
- Description of defect resolutions and bug fixes.

### Security
- Description of security patches and vulnerability remediations.
```

**Formatting Requirements:**
* **Unreleased Changes**: Document pending modifications under `## [Unreleased]` at the top of the changelog.
* **Date Format**: ISO 8601 standard (`YYYY-MM-DD`) for international consistency.
* **Chronological Order**: Descending order by version (most recent first).
* **Semantic Versioning**: All version numbers must follow `MAJOR.MINOR.PATCH` convention.

---

## 4. Change Categories

### 4.1 Standard Categories

The following categories shall be utilized for documenting changes:

| Category | Purpose | Examples |
|----------|---------|----------|
| **Added** | New features, capabilities, or public endpoints | Analytics dashboard, Webhook subscriptions, CLI tool |
| **Changed** | Modifications to existing functionality or public behavior | OAuth flow update, database schema migration, responsive UI redesign |
| **Deprecated** | Features scheduled for removal (provide migration guidance) | Legacy SOAP API, CSV import endpoint, old authentication tokens |
| **Removed** | Deleted features or breaking changes (document impact) | Legacy payment gateway, IE11 support, deprecated reporting module |
| **Fixed** | Bug fixes and defect resolutions | Race condition in job scheduler, incorrect locale parsing, cache eviction bug |
| **Security** | Security fixes, hardening, and vulnerability mitigations | Enforced CSP headers, rotated encryption keys, migrated to Argon2 hashing |

### 4.2 Category Usage Guidelines

* **Required Categories**: Added, Changed, Fixed, Removed
* **Conditional Categories**: Security (for security-related updates), Deprecated (for transition planning)
* **Category Omission**: Exclude categories with no applicable changes for a given release

---

## 5. Content Guidelines

### 5.1 Entry Composition

Each changelog entry should:

* Begin with an action verb (Added, Updated, Fixed, Removed, etc.)
* Provide sufficient context for understanding the change
* Reference relevant issue tracking numbers or pull requests
* Maintain a professional, technical tone
* Be concise yet comprehensive

### 5.2 Reference Standards

* **Issue References**: `(#123)` or `(Issue #123)`
* **Pull Request References**: `(PR #456)` or `(Pull Request #456)`
* **Multiple References**: `(#123, #124, #125)`
* **External Links**: Use descriptive link text with URLs when necessary

### 5.3 Writing Best Practices

* Use present tense for consistency
* Focus on user-facing changes and impacts
* Avoid internal implementation details unless relevant
* Group related changes logically within categories
* Maintain parallel grammatical structure across entries

---

## 6. Comprehensive Example

```markdown
# Changelog

All notable changes to the Eduvoka platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]

### Added
- VAK-based user learning profile: detect and store Visual / Auditory / Kinesthetic preferences via short onboarding questionnaire and passive behavior signals. (PR #789)
- Personalized content recommendations and UI adjustments based on VAK profile (e.g., enhanced visual aids, optional audio explanations, interactive practice for kinesthetic learners).

## Changed
- Refactored user profile schema to include VAK learning style attributes. (Issue #456)
- Updated onboarding flow to incorporate VAK questionnaire. (PR #790)

## [v1.2.0] - 2026-01-05

### Added
- Try Out UTBK mode: full-length timed simulated UTBK tests with sectional timers, answer review, and per-test scoring.
- Automated question generation via Gemini API for curriculum-aligned UTBK items and plausible distractors.
- Adaptive difficulty engine to tailor subsequent questions based on user performance.
- Practice session analytics and export (PDF/CSV) for performance tracking.
- Content moderation and tagging pipeline for generated questions.

### Changed
- Dashboard updated to highlight Try Out UTBK progress, subject filters, and leaderboards.
- Optimized question-generation pipeline for lower latency and caching of generated items.
- Improved API rate-limit handling and retry/backoff for Gemini integrations.

### Fixed
- Resolved metadata mismatch between generated questions and scoring engine.
- Fixed occasional crash when rendering images in generated questions.
- Corrected sectional timer resume behavior after pause.

### Security
- Sanitized generated content to prevent injection/XSS vectors.
- Rotated and secured Gemini API keys; secrets moved to vault-backed storage.
- Added usage monitoring and anomaly detection for automated question generation.



## 7. Maintenance Guidelines

### 7.1 Quality Standards

* **Accuracy**: Ensure all documented changes are implemented in the corresponding release
* **Completeness**: Document all user-facing changes without exception
* **Consistency**: Maintain uniform formatting, terminology, and structure
* **Timeliness**: Update changelog contemporaneously with development activities


### 7.2 Deprecation Notice Guidelines

When documenting deprecated features:

* Specify the version in which deprecation is announced
* Indicate the planned removal version
* Provide migration guidance or alternative solutions
* Reference documentation for transition assistance

**Example:**
```markdown
### Deprecated
- Legacy authentication API (v1) is deprecated and will be removed in v2.0.0. 
  Migrate to v2 authentication endpoints. See migration guide: [link] (#123)
```

---

## 9. Prohibited Practices

* **Avoid**: Vague descriptions such as "Various bug fixes" or "Performance improvements"
* **Avoid**: Including internal implementation details irrelevant to users
* **Avoid**: Documenting minor code refactoring unless it impacts functionality
* **Avoid**: Inconsistent formatting or terminology across entries
* **Avoid**: Retroactive modification of released version entries without clear notation

---

## 10. Additional Resources

* [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) - Changelog format specification
* [Semantic Versioning](https://semver.org/spec/v2.0.0.html) - Version numbering standards
* [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) - Date format standard

---

**Maintained By:** Eduvoka Development Team