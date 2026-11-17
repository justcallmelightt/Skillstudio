---
name: skill-studio
description: Create or improve an agent SKILL.md from a real recurring workflow. Use when someone asks for a reusable Skill, wants to turn repeated instructions into a Skill, or asks to review an existing Skill's scope and activation description.
---

# Skill Studio

Turn a repeatable way of working into a Skill another agent can use without the original conversation.

## Find the reusable part

- Identify the task, when the Skill should apply, the decisions that improve the result, and how the result can be checked. Ask only for details that cannot be inferred from the request or supplied files.
- Separate recurring instructions from facts tied to one project. Keep project-specific paths, commands, and design choices only when the user intends the Skill for that project.
- If the request is a one-off action with no reusable guidance, explain that briefly and do the requested task instead of manufacturing a Skill.

## Write the Skill

- Give it a short lowercase, hyphenated name and a description that says what it does and when to use it. The description should help an agent select the Skill without claiming it covers unrelated tasks.
- Put the essential workflow and decision criteria in `SKILL.md`. State useful constraints and completion checks; avoid generic reminders, fixed steps where judgment is needed, and promises of guaranteed quality or token savings.
- Add references, scripts, or assets only when the task needs them. Keep optional detail out of the main file and link to it where relevant.
- Use the user's language for user-facing explanations. Keep the Skill itself readable by the agents and tools the user plans to use.

## Check before handing over

- Review the frontmatter, name, description, links, and any instructions that depend on files or tools. Remove placeholders and unsupported claims.
- Test against one realistic request: would the agent know when to use this Skill, what to do differently, and when to stop? If not, revise the Skill.
- Give the user the finished `SKILL.md`, its intended folder name, and a short example request. If the user is working in the Skill Studio website, explain that the site previews and downloads the file but does not run AI or install the Skill.
