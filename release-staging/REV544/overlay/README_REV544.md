REV544 / v1.18.57
Multi-Link JSON import accepts optional null profitFactor exactly as exported, without inventing a numeric value. Present numeric profit factors must be finite and non-negative. Invalid rows identify their analyst. All other import guards remain active.
