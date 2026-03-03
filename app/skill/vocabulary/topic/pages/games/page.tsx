import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_GAMES_WORDS } from '../../data/words/games';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('games');

export default function VocabularyGamesPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_GAMES_WORDS} />;
}
