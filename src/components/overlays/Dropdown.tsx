import { useEffect } from 'react';
import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/* Remplacé par le bundler de l'app (Vite, webpack…), donc le bloc disparaît en
   production. `declare` local plutôt qu'une dépendance @types/node ajoutée au paquet —
   même parade que dans ActionSheet. */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Menu panel, radius 2xl, --shadow-lg. Items highlight on --accent.
 *
 * NOM ACCESSIBLE — v0.10.0. Le panneau est un role="menu" : `aria-label` le nomme, ou
 * `aria-labelledby` vers le bouton ⋯ qui l'ouvre. Ni l'un ni l'autre : repli sur « Actions »
 * et avertissement en développement — comme son jumeau mobile, `ActionSheet`.
 */
export interface DropdownItem {
  label?: ReactNode;
  icon?: ReactNode;
  hint?: ReactNode;
  danger?: boolean;
  separator?: boolean;
  onSelect?: () => void;
  /** Classes en plus sur le <button> de l'item — les aides d'état de la vitrine
   *  (`is-hover`…) passent par ici. */
  className?: string;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  items?: DropdownItem[];
  /** Render in flow instead of absolutely positioned. */
  inline?: boolean;
  /**
   * Nom accessible du menu (v0.10.0) — le même texte que l'`ActionSheet` jumelle. Repli :
   * « Actions ». Un `aria-labelledby` passé à la place l'emporte.
   */
  'aria-label'?: string;
}

export function Dropdown({
  items = [], inline = false, className = '',
  'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...rest
}: DropdownProps): JSX.Element {
  /* Filet de développement — un menu sans nom est muet pour le lecteur d'écran, et rien ne
     le voit à l'écran. */
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (ariaLabel || ariaLabelledBy) return;
    console.warn(
      '[ds] Dropdown sans `aria-label` ni `aria-labelledby` : le lecteur d\'écran annonce '
      + '« Actions », qui ne dit pas de quoi c\'est le menu. Passe `aria-label` — le même texte '
      + 'que l\'ActionSheet jumelle.',
    );
  }, [ariaLabel, ariaLabelledBy]);

  return (
    <div
      className={cn('ds-dropdown', !inline && 'ds-dropdown--floating', className)}
      role="menu"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? 'Actions')}
      {...rest}
    >
      {items.map((it, i) => it.separator
        ? <hr key={i} className="ds-dropdown__sep" />
        : (
          <button
            key={i}
            type="button"
            role="menuitem"
            onClick={it.onSelect}
            className={cn('ds-dropdown__item', it.danger && 'ds-dropdown__item--danger', it.className)}
          >
            {it.icon}
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.hint ? <span className="ds-dropdown__hint">{it.hint}</span> : null}
          </button>
        ))}
    </div>
  );
}
