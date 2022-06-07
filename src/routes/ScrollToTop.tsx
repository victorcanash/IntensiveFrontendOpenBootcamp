import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router';

import { ApplicationContext } from '../contexts/ApplicationContext';
import isEmpty from '../utils/isEmpty';


export const ScrollToTop = (props: any) => {

  const { pageContainer } = useContext(ApplicationContext);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isEmpty(pageContainer)) {
      console.log(pageContainer);
      pageContainer.scrollTo(0, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (<>{props.children}</>);
};
