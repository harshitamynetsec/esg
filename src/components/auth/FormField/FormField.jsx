import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './FormField.module.scss';

export default function FormField({
  icon,
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
}) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (revealed ? 'text' : 'password') : type;
  const inputId = `field-${name}`;

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
        <input
          id={inputId}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={styles.input}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
          >
            <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
    </div>
  );
}
