import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SIZE_WORDS } from '../../data/words/size';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('size');

export default function VocabularySizePage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SIZE_WORDS} />;
}
