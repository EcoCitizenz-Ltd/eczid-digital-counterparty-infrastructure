# ECZ-ID Digital Counterparty Infrastructure

## Know who you depend on, which digital surfaces you rely on, and what changed.

Modern counterparty relationships are increasingly digital.

A supplier may interact with your organisation through websites, portals, APIs, software, AI agents, MCP servers, cloud services and other machine identities.

A traditional supplier record does not automatically tell you which of those surfaces are current, who operates them, or where their latest evidence can be reviewed.

This repository provides a practical framework for digital-counterparty review.

## Start here

- [Explore EcoCitizenz](https://www.ecocitizenz.com?utm_source=github&utm_medium=repository&utm_campaign=dci&utm_content=home)
- [Business Passport & Machine Identity](https://github.com/EcoCitizenz-Ltd/eczid-business-passport-machine-identity)
- [API Passport Starter](https://github.com/EcoCitizenz-Ltd/eczid-api-passport-starter)
- [Software Supply Chain Evidence](https://github.com/EcoCitizenz-Ltd/eczid-software-supply-chain-evidence)
- [Start with TrustOps](https://trustops.ecocitizenz.com/start?utm_source=github&utm_medium=repository&utm_campaign=dci&utm_content=start)

---

## The digital-counterparty problem

Procurement commonly records:

- supplier name
- company number
- address
- contract
- account owner

Operational teams actually rely on:

- domains
- portals
- APIs
- SaaS instances
- software packages
- AI systems
- machine identities
- infrastructure endpoints

The two views should connect.

---

## Digital Counterparty Register

| Area | What to record |
|---|---|
| Organisation | Legal / trading identity |
| Stable identity | ECZ-ID or other reference |
| Website / portal | Production surface |
| APIs | Critical machine interfaces |
| Software | Important supplied software |
| Agents / MCP | Agentic or MCP dependencies |
| Evidence | Current evidence locations |
| Owner | Internal accountable owner |
| Freshness | Last review / evidence timestamp |
| Change | Material change since last review |
| Incident route | Contact / escalation path |

---

## Counterparty review workflow

```text
Identify counterparty
        |
        v
Resolve organisation identity
        |
        v
Inventory digital surfaces
        |
        v
Collect current evidence
        |
        v
Check freshness and change
        |
        v
Apply procurement / security policy
        |
        v
Record decision
        |
        v
Re-check over time
```

---

## 20 practical checks

### Identity

- [ ] Organisation identified
- [ ] Stable identity reference recorded
- [ ] Responsible owner known
- [ ] Parent/child relationships understood

### Digital surface

- [ ] Primary web domain recorded
- [ ] Customer/admin portals recorded
- [ ] Critical APIs identified
- [ ] Important software dependencies identified
- [ ] Agent/MCP dependencies identified where relevant

### Evidence

- [ ] Security evidence location recorded
- [ ] Software/SBOM evidence recorded where applicable
- [ ] Provenance/source references recorded
- [ ] Evidence timestamps visible
- [ ] Lifecycle/withdrawal state reviewable

### Operations

- [ ] Internal service owner named
- [ ] Counterparty incident route known
- [ ] Material change can be detected
- [ ] Review cadence established
- [ ] Exceptions are documented
- [ ] Decision follows local policy

---

## Procurement handoff

A useful counterparty evidence package should help procurement answer:

> Who are we contracting with?

and technical teams answer:

> Which digital surfaces are we actually relying on?

That shared view reduces the gap between the contract record and the operational dependency.

---

## Related resources

- [API Passport Starter](https://github.com/EcoCitizenz-Ltd/eczid-api-passport-starter)
- [Software Supply Chain Evidence](https://github.com/EcoCitizenz-Ltd/eczid-software-supply-chain-evidence)
- [MSP / MSSP Machine Trust Toolkit](https://github.com/EcoCitizenz-Ltd/eczid-msp-machine-trust-toolkit)

---

## What DCI does not mean

Digital Counterparty Infrastructure supports repeatable identity and evidence review.

It should not be represented as automatically proving that a counterparty is safe, compliant, certified, approved or low risk.

Those conclusions depend on evidence, context and the relying organisation's policy.

---

## Public operator proof

**ECZ-ID VERIFIED - ECZ-GB-RBS1NW**

[View current public identity and evidence](https://resolver.ecocitizenz.org/passport/ECZ-GB-RBS1NW)

---

## Automate counterparty identity re-checks

When a counterparty provides a parent ECZ-ID, its public Resolver posture can be re-checked from CI without uploading source code:

```yaml
- name: Re-check counterparty ECZ-ID posture
  uses: Ecocitizenz/ecz-id-mcp-verifier@v0.8.4
  with:
    target: ECZ-GB-RBS1NW
    policy: PREFER
```

[ECZ-ID MCP Verifier](https://github.com/Ecocitizenz/ecz-id-mcp-verifier)

Use this only as one evidence input. Counterparty acceptance remains a procurement/security policy decision.
