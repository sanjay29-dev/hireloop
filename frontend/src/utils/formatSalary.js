/**
 * Formats salary ranges based on currency (INR ₹ vs USD $).
 */
export function formatSalary(min, max, currency = 'INR') {
  if (!min && !max) return 'Not disclosed';

  const isINR = currency === 'INR' || (!currency && min > 100000);

  if (isINR) {
    const formatLakhs = (val) => {
      if (!val) return '';
      if (val >= 100000) {
        const lpa = (val / 100000).toFixed(val % 100000 === 0 ? 0 : 1);
        return `₹${lpa} LPA`;
      }
      return `₹${val.toLocaleString('en-IN')}`;
    };

    if (min && max) {
      if (min >= 100000 && max >= 100000) {
        const minLpa = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
        const maxLpa = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
        return `₹${minLpa} - ₹${maxLpa} LPA`;
      }
      return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
    }
    return formatLakhs(min || max);
  }

  // International / USD formatting
  const formatUSD = (val) => {
    if (!val) return '';
    if (val >= 1000) {
      const k = (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1);
      return `$${k}k`;
    }
    return `$${val.toLocaleString('en-US')}`;
  };

  if (min && max) {
    return `${formatUSD(min)} - ${formatUSD(max)} / yr`;
  }
  return `${formatUSD(min || max)} / yr`;
}
