import cases, { ReactCases } from './reactcases.config';

function generateRoutesFromConfig(config: ReactCases) {
  const keys = Object.keys(config);

  return keys.reduce((res: any[], key) => {
    return [
      ...res,
      {
        name: key,
        path: config[key].path,
        component: config[key].component,
      },
    ];
  }, []);
}

const dynamicRoutes = generateRoutesFromConfig(cases);

console.log(dynamicRoutes);

export default [
  {
    path: '/',
    component: '@/layouts/CaseLayout',
    routes: [
      ...generateRoutesFromConfig(cases),
      {
        redirect: dynamicRoutes[0].path,
      },
    ],
  },
  {
    component: './404',
  },
];
