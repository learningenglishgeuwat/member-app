import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_COLOR_WORDS } from '../../data/words/color';
import '../../shared/vocabulary.css';
import '../../shared/vocabulary-color.css';

const topic = getVocabularyTopicById('color');

export default function VocabularyColorPage() {
  return (
    <VocabularyTopicDetailPage
      topic={topic}
      topicWords={VOCAB_TOPIC_COLOR_WORDS}
      isColorTopic
    />
  );
}
