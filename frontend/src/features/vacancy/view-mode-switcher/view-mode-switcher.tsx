import {VacancyViewMode} from "@/features/vacancy/view-mode-switcher/model/view-mode";

type Props = {
    value: VacancyViewMode;
    onChange: (value: VacancyViewMode) => void;
};

export const ViewModeSwitcher = ({ value, onChange }: Props) => {
    return (
        <div className="inline-flex rounded-lg border p-1">
            <button
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm ${
                    value === 'list' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => onChange('list')}
            >
                List
            </button>

            <button
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm ${
                    value === 'board' ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => onChange('board')}
            >
                Board
            </button>
        </div>
    );
};