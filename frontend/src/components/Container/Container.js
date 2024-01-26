import styles from './Container.module.scss';

const Container = ({ children, className, ...rest }) => {
  let containerClassName = styles.container;

  return (
    <div data-testid="container" className={containerClassName} {...rest}>
      {children}
    </div>
  );
};

export default Container;
