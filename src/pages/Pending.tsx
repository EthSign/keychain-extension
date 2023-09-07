import EntryContent from "../components/EntryContent";
import NeverSaveBar from "../components/NeverSaveBar";
import OriginPill from "../components/OriginPill";
import TopBar from "../components/TopBar";
import Button from "../ui/forms/Button";

interface PendingProps {
  url: string;
  pending: Record<
    string,
    {
      url: string;
      username: string;
      password: string;
      update?: boolean | undefined;
      controlled?: string;
    }
  >;
  handlePending: React.Dispatch<
    React.SetStateAction<
      | Record<
          string,
          {
            url: string;
            username: string;
            password: string;
            update?: boolean | undefined;
          }
        >
      | undefined
    >
  >;
  clearPendingForSite: () => void;
  persistPending: () => void;
  neverSaveForSite: () => void;
}

function Pending(props: PendingProps) {
  const { url, pending, clearPendingForSite, persistPending, neverSaveForSite } = props;

  return (
    <>
      <TopBar />
      <div className="my-8 flex flex-col items-center">
        <OriginPill url={url} />
        <div className="text-2xl font-semibold mt-4 text-center">
          Would you like to save your password for this site?
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg mb-8">
        <EntryContent credential={{ ...pending[url ?? ""] }} />
      </div>

      <div className="flex flex-row gap-2 mb-8">
        <Button className="w-full py-3" style="secondary" customSizing onClick={clearPendingForSite}>
          Not Now
        </Button>
        <Button className="w-full py-3" customSizing onClick={persistPending}>
          Save Password
        </Button>
      </div>

      <NeverSaveBar neverSave={neverSaveForSite} />
    </>
  );
}

export default Pending;
