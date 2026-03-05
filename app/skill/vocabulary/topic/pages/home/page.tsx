import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_HOME_WORDS } from '../../data/words/home';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('home');

export default function VocabularyHomePage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_HOME_WORDS} />;
}
