import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './FormSelect.module.scss';

export default function FormSelect({
  icon,
  label,
  name,
  placeholder,
  value,
  onChange,
  options,
  required = false,
}) {
  const inputId = `select-${name}`;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <span className={styles.icon} aria-hidden="true">
          <FontAwesomeIcon icon={icon} />
        </span>
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${styles.select} ${value ? styles.hasValue : ''}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </div>
    </div>
  );
}
