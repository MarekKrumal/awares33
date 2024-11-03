import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";
import UserLinkWithTooltip from "./UserLinkWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

// Linkify package muze jenom "linkify" URLs ne #hashtags nebo @mention ale muzem regex abychom je mohli pouzit take a dame je to jinych konponent
export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  ); //ted je tento return ready na pouzity obalime tim content a linky budou fungovat pro @, #, URLs
}

//Linkify pro URL
function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl> //Linky sou v talwind unstyled by defaut
  );
}

//Linkify pro username pomoci regex <LinkIt regex={@}></LinkIt> tato komponenta udela link ze vseho co zacina "@" a ma cisla a pismena -_ za tim(@)
function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      //musime rict linkify jakou komponentu ma vratit, match je text a key je z Linku
      component={(match, key) => (
        <UserLinkWithTooltip
          key={key}
          username={match.slice(1)} //slice proto ze potrebuje text bez oznaceni @priklad ===> priklad
        >
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
}

//Linkify pro #hashtag ,tato komponenta udela link ze vseho co zacina "#" a ma cisla a pismena -_ za tim(#)
function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`} //slice proto ze potrebuje text bez hashtagu #priklad ===> priklad
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
}
