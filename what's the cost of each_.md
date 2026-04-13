<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# what's the cost of each?

The pricing section has been added to your Google Doc report. Here's the full breakdown:

***

## API Pricing Breakdown (March 2026)

### Runway Gen-3[^1][^2]

Billing: **credits per second** (~\$0.01/credit)


| Model | Rate | 5s clip | 10s clip |
| :-- | :-- | :-- | :-- |
| Gen-3 Alpha **Turbo** | 5 cr/sec = **\$0.05/sec** | ~\$0.25 | ~\$0.50 |
| Gen-3 Alpha Standard | 10 cr/sec = **\$0.10/sec** | ~\$0.50 | ~\$1.00 |
| Gen-4.5 | 12 cr/sec = **\$0.12/sec** | — | ~\$1.20 |

Free tier: 125 credits on signup (~10s of Turbo video)[^3]

***

### MiniMax Hailuo 2.3[^4]

Billing: **flat rate per clip** (official `platform.minimax.io`)


| Model | Resolution | Duration | Price |
| :-- | :-- | :-- | :-- |
| Hailuo-2.3 | 768P | 6s | **\$0.28** |
| Hailuo-2.3 | 768P | 10s | **\$0.56** |
| Hailuo-2.3 | 1080P | 6s | **\$0.49** |
| Hailuo-2.3-Fast (I2V) | 768P | 6s | **\$0.19** |
| Hailuo-2.3-Fast (I2V) | 1080P | 6s | **\$0.33** |
| Hailuo-02 (budget) | 512P | 6s | **\$0.10** |

**Replicate** (same model, native n8n node): identical pricing — \$0.28 per 768P/6s clip, ~35 clips for \$10[^5]

***

### Kling AI[^6][^7]

Billing: **per second** — varies by provider


| Provider | Model | Rate | 10s clip |
| :-- | :-- | :-- | :-- |
| Official API | v2.6 Standard | \$0.084/sec | ~\$0.84 |
| Official API | v2.6 Pro | \$0.112/sec | ~\$1.12 |
| Official API | 3.0 Pro | \$0.168/sec | ~\$1.68 |
| **EvoLink.ai** (cheapest) | 3.0 Standard | **\$0.075/sec** | ~**\$0.75** |
| **EvoLink.ai** | 3.0 Pro | **\$0.100/sec** | ~**\$1.00** |
| fal.ai / WaveSpeed | 3.0 Standard | \$0.168/sec | ~\$1.68 |
| fal.ai / WaveSpeed | 3.0 Pro | \$0.224/sec | ~\$2.24 |


***

### Cost Summary: 100 clips batch

| Option | ~Total |
| :-- | :-- |
| Hailuo-2.3 via Replicate (768P, 6s) | **~\$28** ← cheapest |
| Hailuo-2.3 direct (1080P, 6s) | **~\$49** |
| Runway Gen-3 Turbo (10s) | **~\$50** |
| Kling 3.0 Std via EvoLink (10s) | **~\$75** |
| Runway Gen-3 Standard (10s) | **~\$100** |
| Kling 3.0 Pro via EvoLink (10s) | **~\$100** |
| Kling 3.0 Std via fal.ai (10s) | **~\$168** |
| Kling 3.0 Pro via fal.ai (10s) | **~\$224** |


***

**Key takeaway:** Hailuo 2.3 via Replicate is the cheapest path at ~\$0.28–\$0.49/clip with the easiest n8n integration. Runway Gen-3 Turbo is the middle ground at ~\$0.50/clip with the most workflow templates. Kling has the best quality ceiling but costs 2–4x more depending on where you access it — EvoLink is the cheapest Kling gateway at ~55% less than fal.ai for the same model.[^7]

Remember: if you generate 3–5 variations per slot and pick the best, multiply your per-clip cost by ~4x to get real production cost.

<div align="center">⁂</div>

[^1]: https://docs.dev.runwayml.com/guides/pricing/

[^2]: https://www.imagine.art/blogs/runway-ai-pricing

[^3]: https://fluxnote.io/guides/runway-gen3-alpha-guide

[^4]: https://platform.minimax.io/docs/guides/pricing-paygo

[^5]: https://replicate.com/minimax/hailuo-2.3

[^6]: https://www.atlascloud.ai/blog/kling-3.0-review-features-pricing-ai-alternatives

[^7]: https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers

