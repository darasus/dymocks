export const datafile = {
  experiments: {
    'experiment.name.one': {
      id: 'experiment.name.one',
      percentage: 90,
      variations: [
        {
          id: 'control',
          percentage: 50,
        },
        {
          id: 'variate-1',
          percentage: 25,
        },
        {
          id: 'variate-2',
          percentage: 25,
        },
      ],
    },
    'experiment.name.two': {
      id: 'experiment.name.two',
      percentage: 100,
      variations: [
        {
          id: 'control',
          percentage: 50,
        },
        {
          id: 'variate-1',
          percentage: 50,
        },
      ],
      audience: {
        '==': [{ var: 'countryCode' }, 'us'],
      },
    },
  },
  features: {
    'feature.name.one': {
      id: 'feature.name.one',
      percentage: 50,
    },
  },
}
