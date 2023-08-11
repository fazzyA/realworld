import { useContext, useState } from 'react';
import { thumbsDownArticle, thumbsUpArticle } from '../services/article.service';
import { Article } from '../models/article.model';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/auth.context';

interface Props {
  article: Article;
  isExtended?: boolean;
}

export default function ThumbsDownButton({ article, isExtended }: Props) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(article);

  const [count, setCount] = useState(article.favoritesCount);
  const [favorited, setFavorited] = useState(article.favorited);
  const [isLoading, setIsLoading] = useState(false);

  async function updateCount(): Promise<void> {
    if (!user) {
      navigate('/register');
    }

    setIsLoading(true);
    setFavorited(favorited => !favorited);

    if (favorited) {
      setCount(count => count - 1);
      await thumbsUpArticle(article.slug);
    } else {
      setCount(count => count + 1);
      await thumbsDownArticle(article.slug);
    }

    setIsLoading(false);
  }

  if (isExtended) {
    return (
      <button
        className={`btn btn-sm btn-${!favorited ? 'outline-' : ''}primary`}
        onClick={updateCount}
        disabled={isLoading}
      >
        <i className="ion-thumb-down"></i> {favorited ? 'Unfavorite' : 'Favorite'} Article{' '}
        <span className="counter">({count})</span>
      </button>
    );
  } else {
    return (
      <button
        className={`btn btn-sm btn-${!favorited ? 'outline-' : ''}primary pull-xs-right`}
        onClick={updateCount}
        disabled={isLoading}
      >
        <i className="ion-thumb-down">cc</i> {count}
      </button>
    );
  }
}
