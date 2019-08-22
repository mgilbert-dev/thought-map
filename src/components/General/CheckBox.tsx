import React, { FC, ChangeEvent } from 'react';

interface CheckBoxProps {
  id?: string,
  classes?: any,
  isChecked: boolean,
  value: string,
  onChange: (event: ChangeEvent) => void,
  label?: string,
  title?: string,
  [rest: string]: any,
}

export const CheckBox: FC<CheckBoxProps> = React.memo(({ id, classes, isChecked, value, onChange, label, title, ...rest }) => {

  return (
    <label id={id} title={title} className={classes.checkboxLabel} {...rest}>
      <input type={'checkbox'} name={label} value={value} checked={isChecked} onChange={onChange}/>
      {label}
    </label>
  );
});

export default CheckBox;