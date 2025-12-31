# Release Management Guide

This document establishes the standardized semantic versioning system for Eduvoka.

---

## 1. Version Numbering System

The project adheres to a streamlined **Semantic Versioning** format: `MAJOR.MINOR.PATCH`

* **MAJOR**: Introduces breaking changes modifications.
* **MINOR**: Delivers new functionality or enhancements while maintaining backward compatibility.
* **PATCH**: Addresses defects and implements minor improvements without breaking existing functionality.

**Illustrative Examples:**
* `1.0.0` → Initial production release.
* `1.1.0` → Introduction of TO UTBK feature.
* `1.1.1` → Resolution of a bug in the TO UTBK feature.

> **Note:** Pre-release versions (e.g., `1.2.0-beta.1`) may be utilized for testing purposes; however, production deployments must exclusively use stable release versions.

---

## 2. Development Workflow

### 2.1 Feature Development Procedure

1. Navigate to the `development` branch and create a feature branch:
   ```bash
   git checkout development
   git checkout -b feat/new-functionality
   ```

2. Implement modifications, commit changes, and push to remote:
   ```bash
   git push -u origin feat/new-functionality
   ```

3. Initiate a Pull Request (PR) from `feat/new-functionality` to `development`. Upon approval and successful review, merge and remove the feature branch.

### 2.2 Release Initiation

1. From the `development` branch, establish a release branch:
   ```bash
   git checkout development
   git checkout -b release/v1.2.0
   ```

2. Update version identifiers in `package.json` and associated configuration files.

3. Update `CHANGELOG.md` to document new features, enhancements, and resolved issues.

4. Execute comprehensive test suite to verify system stability and integrity.

### 2.3 Release Finalization

1. Create a Pull Request from `release/v1.2.0` to `main`. Upon approval, merge the release branch into `main`.

2. Within the `main` branch, apply version tag:
   ```bash
   git checkout main
   git tag v1.2.0
   ```

3. Integrate release changes back into `development` and remove the release branch:
   ```bash
   git checkout development
   git merge --no-ff main
   git branch -d release/v1.2.0
   ```

4. Propagate changes and tags to remote repository:
   ```bash
   git push origin main development --tags
   ```

5. Deploy the `main` branch to the production environment.

### 2.4 Hotfix Procedure

1. For critical production incidents, create a hotfix branch from `main`:
   ```bash
   git checkout main
   git checkout -b hotfix/v1.2.1
   ```

2. Implement corrective measures, commit modifications, and push the hotfix branch.

3. Create a Pull Request from `hotfix/v1.2.1` to `main`. Following merge approval, apply version tag:
   ```bash
   git checkout main
   git merge --no-ff hotfix/v1.2.1
   git tag v1.2.1
   ```

4. Integrate hotfix into `development` and remove the branch:
   ```bash
   git checkout development
   git merge --no-ff main
   git branch -d hotfix/v1.2.1
   git push origin main development --tags
   ```

---

## 3. Branch Strategy Summary

| Branch Type | Purpose | Base Branch | Merge Target |
|-------------|---------|-------------|--------------|
| `main` | Production-ready code | - | - |
| `development` | Integration branch for features | `main` | `main` |
| `feat/*` | New feature development | `development` | `development` |
| `release/*` | Release preparation | `development` | `main` & `development` |
| `hotfix/*` | Critical production fixes | `main` | `main` & `development` |

---