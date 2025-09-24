// 全局变量
let meetingDate = new Date('2025-02-07'); // 固定的相遇日期
let currentPhotoTarget = null;
let isPlayingMusic = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    startLoveCounter();
    updateMeetingDateDisplay(); // 确保相遇日期正确显示
    checkAudioStatus(); // 检查音频加载状态
    initPhotoCarousel(); // 初始化图片轮播
    // 使用固定内容，确保所有访问者看到相同内容
});

// 初始化页面
function initializePage() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);

    // 初始化背景音乐按钮状态
    updateMusicButtonState();
}

// 设置相遇日期
function setMeetingDate() {
    const userDate = prompt('请输入你们相遇的日期 (格式: YYYY-MM-DD):', '2024-01-01');
    
    if (userDate && isValidDate(userDate)) {
        meetingDate = new Date(userDate);
        updateMeetingDateDisplay();
        saveToLocalStorage('meetingDate', userDate);
        
        // 立即更新计时器
        updateLoveCounter();
        
        // 显示设置成功的反馈
        showNotification('相遇日期设置成功！💕');
    } else if (userDate !== null) {
        alert('请输入正确的日期格式 (YYYY-MM-DD)');
    }
}

// 验证日期格式
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    const timestamp = date.getTime();
    
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) return false;
    
    return date.toISOString().startsWith(dateString);
}

// 更新相遇日期显示
function updateMeetingDateDisplay() {
    const dateValueElement = document.querySelector('.date-value');
    if (meetingDate) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        dateValueElement.textContent = meetingDate.toLocaleDateString('zh-CN', options);
        dateValueElement.style.color = '#fff';
    }
}

// 相遇日期显示将在主初始化函数中处理

// 更新爱情计数器
function updateLoveCounter() {
    console.log('计时器更新中...', meetingDate);
    
    if (!meetingDate) {
        console.log('没有设置相遇日期');
        document.getElementById('days-count').textContent = '∞';
        document.getElementById('hours-count').textContent = '∞';
        document.getElementById('minutes-count').textContent = '∞';
        return;
    }

    const now = new Date();
    const diffTime = Math.abs(now - meetingDate);
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    console.log(`计算结果: ${days}天 ${hours}小时 ${minutes}分钟`);
    
    // 直接设置文本，不使用动画
    document.getElementById('days-count').textContent = days;
    document.getElementById('hours-count').textContent = hours;
    document.getElementById('minutes-count').textContent = minutes;
}

// 开始爱情计数器
function startLoveCounter() {
    updateLoveCounter();
    setInterval(updateLoveCounter, 1000); // 每秒更新一次，立即看到变化
}

// 数字滚动动画
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const currentNumber = parseInt(element.textContent) || 0;
    
    if (currentNumber === targetNumber) return;
    
    const increment = targetNumber > currentNumber ? 1 : -1;
    const steps = Math.abs(targetNumber - currentNumber);
    const stepTime = Math.min(50, 1000 / steps);
    
    let current = currentNumber;
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === targetNumber) {
            clearInterval(timer);
        }
    }, stepTime);
}

// 照片上传功能
function uploadPhoto(placeholder) {
    currentPhotoTarget = placeholder;
    document.getElementById('photo-input').click();
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && currentPhotoTarget) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = '美好回忆';
                
                // 添加淡入效果
                img.style.opacity = '0';
                img.onload = function() {
                    currentPhotoTarget.innerHTML = '';
                    currentPhotoTarget.appendChild(img);
                    img.style.transition = 'opacity 0.5s ease-in-out';
                    setTimeout(() => img.style.opacity = '1', 100);
                };
                
                // 保存到本地存储
                savePhotoToLocalStorage(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择图片文件！');
        }
    }
    // 清空文件输入，允许重复选择相同文件
    event.target.value = '';
}

// 保存旅游计划
function saveTravelPlan() {
    const travelText = document.getElementById('travel-text').value.trim();
    
    if (!travelText) {
        alert('请先写下你们的旅游足迹或计划！');
        return;
    }
    
    const now = new Date();
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // 显示保存的旅游记录
    document.getElementById('travel-display').textContent = travelText;
    document.getElementById('travel-date').textContent = dateString;
    document.getElementById('saved-travel').style.display = 'block';
    
    // 隐藏输入框
    document.querySelector('.travel-input-box').style.display = 'none';
    
    // 保存到本地存储
    saveToLocalStorage('travel', {
        text: travelText,
        date: dateString
    });
    
    // 显示成功反馈
    showNotification('旅游记录保存成功！🌍');
}

// 创建爱心爆炸效果
function createHeartBurst(event) {
    // 防止事件冒泡
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🤎', '🖤'];
    const heartClickArea = document.querySelector('.heart-click-area');
    
    if (!heartClickArea) return;
    
    // 获取点击区域的位置信息
    const rect = heartClickArea.getBoundingClientRect();
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-burst';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            
            // 计算随机位置（相对于点击区域）
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            // 设置初始位置和样式
            heart.style.position = 'absolute';
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.transform = `rotate(${Math.random() * 360}deg)`;
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            
            heartClickArea.appendChild(heart);
            
            // 动画结束后移除元素
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 1000);
        }, i * 80);
    }
    
    // 播放点击音效
    playClickSound();
    
    // 添加点击反馈效果
    heartClickArea.style.transform = 'scale(0.95)';
    setTimeout(() => {
        heartClickArea.style.transform = 'scale(1)';
    }, 150);
}

// 音乐控制
function toggleMusic() {
    const audio = document.getElementById('background-music');
    const musicBtn = document.getElementById('music-btn');
    
    if (isPlayingMusic) {
        audio.pause();
        musicBtn.textContent = '🎵';
        musicBtn.title = '播放背景音乐';
        isPlayingMusic = false;
        showNotification('背景音乐已暂停 🎵');
    } else {
        // 设置音量
        audio.volume = 0.3; // 设置较低音量，避免过于突兀
        
        // 由于浏览器的自动播放限制，需要用户交互才能播放音乐
        audio.play().then(() => {
            musicBtn.textContent = '🎶';
            musicBtn.title = '暂停背景音乐';
            isPlayingMusic = true;
            showNotification('背景音乐已开始播放 🎶');
        }).catch(error => {
            console.log('音乐播放失败:', error);
            showNotification('请上传音乐文件到项目中，或者检查网络连接 🎵');
        });
    }
}

// 音频加载状态检查
function checkAudioStatus() {
    const audio = document.getElementById('background-music');
    
    audio.addEventListener('loadstart', () => {
        console.log('开始加载音频文件...');
    });
    
    audio.addEventListener('canplay', () => {
        console.log('音频文件可以播放');
        showNotification('音乐已加载完成，点击 🎵 按钮开始播放');
    });
    
    audio.addEventListener('error', (e) => {
        console.log('音频加载失败:', e);
        showNotification('音乐文件加载失败，请检查文件是否存在');
    });
}

// 调节音量
function adjustVolume(volume) {
    const audio = document.getElementById('background-music');
    audio.volume = parseFloat(volume);
    
    if (volume == 0) {
        showNotification('音量已静音 🔇');
    } else if (volume < 0.3) {
        showNotification('音量：低 🔉');
    } else if (volume < 0.7) {
        showNotification('音量：中 🔊');
    } else {
        showNotification('音量：高 🔊');
    }
}

// 更新音乐按钮状态
function updateMusicButtonState() {
    const savedMusicState = loadFromLocalStorage('musicPlaying');
    if (savedMusicState) {
        isPlayingMusic = savedMusicState;
        const musicBtn = document.getElementById('music-btn');
        musicBtn.textContent = isPlayingMusic ? '🎶' : '🎵';
    }
}

// 播放点击音效
function playClickSound() {
    // 创建简单的音效（使用Web Audio API）
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 5px 20px rgba(255, 107, 107, 0.3);
        z-index: 10000;
        font-size: 1rem;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 本地存储功能
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem('loveMemory_' + key, JSON.stringify(value));
    } catch (error) {
        console.log('保存数据失败:', error);
    }
}

function loadFromLocalStorage(key) {
    try {
        const item = localStorage.getItem('loveMemory_' + key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.log('加载数据失败:', error);
        return null;
    }
}

// 保存照片到本地存储
function savePhotoToLocalStorage(photoData) {
    const photos = loadFromLocalStorage('photos') || [];
    photos.push({
        data: photoData,
        timestamp: Date.now()
    });
    
    // 限制最多保存20张照片
    if (photos.length > 20) {
        photos.shift();
    }
    
    saveToLocalStorage('photos', photos);
}

// 加载保存的数据
function loadSavedData() {
    // 加载相遇日期
    const savedMeetingDate = loadFromLocalStorage('meetingDate');
    if (savedMeetingDate) {
        meetingDate = new Date(savedMeetingDate);
        updateMeetingDateDisplay();
        // 立即更新计时器
        updateLoveCounter();
    }
    
    // 加载保存的旅游记录
    const savedTravel = loadFromLocalStorage('travel');
    if (savedTravel) {
        document.getElementById('travel-display').textContent = savedTravel.text;
        document.getElementById('travel-date').textContent = savedTravel.date;
        document.getElementById('saved-travel').style.display = 'block';
        document.querySelector('.travel-input-box').style.display = 'none';
    }
    
    // 加载保存的照片
    const savedPhotos = loadFromLocalStorage('photos') || [];
    const photoPlaceholders = document.querySelectorAll('.photo-placeholder');
    
    savedPhotos.slice(-4).forEach((photo, index) => {
        if (photoPlaceholders[index]) {
            const img = document.createElement('img');
            img.src = photo.data;
            img.alt = '美好回忆';
            photoPlaceholders[index].innerHTML = '';
            photoPlaceholders[index].appendChild(img);
        }
    });
}

// 添加键盘快捷键
document.addEventListener('keydown', function(event) {
    // 按 M 键切换音乐
    if (event.key.toLowerCase() === 'm' && !event.ctrlKey && !event.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'TEXTAREA' && activeElement.tagName !== 'INPUT') {
            toggleMusic();
            event.preventDefault();
        }
    }
    
    // 按空格键创建爱心效果
    if (event.code === 'Space' && !event.ctrlKey && !event.altKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'TEXTAREA' && activeElement.tagName !== 'INPUT') {
            const heartArea = document.querySelector('.heart-click-area');
            if (heartArea) {
                const rect = heartArea.getBoundingClientRect();
                const fakeEvent = {
                    currentTarget: heartArea
                };
                createHeartBurst(fakeEvent);
                event.preventDefault();
            }
        }
    }
});

// 添加滚动动画效果
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为所有记忆卡片添加观察
    document.querySelectorAll('.memory-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 页面完全加载后添加滚动动画
window.addEventListener('load', function() {
    setTimeout(addScrollAnimations, 500);
});

// ===========================================
// 图片轮播功能
// ===========================================

let currentSlide = 0;
let slides = [];
let autoPlayInterval = null;
let isAutoPlaying = true;
let displayMode = 'contain'; // 'contain' 或 'fill'

// 初始化图片轮播
function initPhotoCarousel() {
    slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    // 设置初始显示模式
    updateDisplayMode();
    
    // 开始自动播放
    startAutoPlay();
    
    // 添加键盘导航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            previousSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleAutoPlay();
        }
    });
    
    // 添加触摸滑动支持
    addTouchSupport();
}

// 显示指定幻灯片
function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    // 移除当前活动状态
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.thumbnail')[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');
    
    // 设置新的活动状态
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.thumbnail')[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
    
    // 添加切换动画
    slides[currentSlide].style.animation = 'slideIn 0.5s ease-in-out';
    setTimeout(() => {
        slides[currentSlide].style.animation = '';
    }, 500);
}

// 上一张
function previousSlide() {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
}

// 下一张  
function nextSlide() {
    const newIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
}

// 开始自动播放
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 4000); // 每4秒切换一次
    isAutoPlaying = true;
    updateAutoPlayButton();
}

// 停止自动播放
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    isAutoPlaying = false;
    updateAutoPlayButton();
}

// 切换自动播放
function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
        showNotification('自动播放已暂停 ⏸️');
    } else {
        startAutoPlay();
        showNotification('自动播放已开启 ▶️');
    }
}

// 更新自动播放按钮
function updateAutoPlayButton() {
    const btn = document.getElementById('auto-play-btn');
    if (btn) {
        btn.textContent = isAutoPlaying ? '⏸️' : '▶️';
        btn.title = isAutoPlaying ? '暂停自动播放' : '开始自动播放';
    }
}

// 上传更多照片
function uploadMorePhotos() {
    document.getElementById('photo-input').click();
}

// 处理多张照片上传
function handleMultiplePhotos(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    let successCount = 0;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addNewSlide(e.target.result, `新添加的照片 ${successCount + 1}`);
                successCount++;
                
                if (successCount === files.length) {
                    showNotification(`成功添加 ${successCount} 张照片！📷`);
                }
            };
            reader.readAsDataURL(file);
        }
    }
    
    // 清空文件输入
    event.target.value = '';
}

// 添加新的幻灯片
function addNewSlide(imageSrc, caption) {
    const carouselTrack = document.getElementById('carousel-track');
    const thumbnailNav = document.querySelector('.thumbnail-nav');
    const indicators = document.querySelector('.carousel-indicators');
    
    // 创建新幻灯片
    const newSlide = document.createElement('div');
    newSlide.className = 'carousel-slide';
    newSlide.innerHTML = `
        <img src="${imageSrc}" alt="${caption}" />
        <div class="slide-caption">${caption}</div>
    `;
    carouselTrack.appendChild(newSlide);
    
    // 创建新缩略图
    const newThumbnail = document.createElement('div');
    newThumbnail.className = 'thumbnail';
    newThumbnail.onclick = () => goToSlide(slides.length);
    newThumbnail.innerHTML = `<img src="${imageSrc}" alt="缩略图" />`;
    thumbnailNav.appendChild(newThumbnail);
    
    // 创建新指示器
    const newIndicator = document.createElement('span');
    newIndicator.className = 'indicator';
    newIndicator.onclick = () => goToSlide(slides.length);
    indicators.appendChild(newIndicator);
    
    // 更新slides数组
    slides = document.querySelectorAll('.carousel-slide');
}

// 添加触摸滑动支持
function addTouchSupport() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    let startX = 0;
    let startY = 0;
    
    carouselContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    carouselContainer.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // 只有水平滑动距离大于垂直滑动距离时才触发
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // 滑动距离阈值
                if (diffX > 0) {
                    nextSlide(); // 向左滑动，显示下一张
                } else {
                    previousSlide(); // 向右滑动，显示上一张
                }
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// 切换图片显示模式
function toggleDisplayMode() {
    displayMode = displayMode === 'contain' ? 'fill' : 'contain';
    updateDisplayMode();
    
    const modeText = displayMode === 'contain' ? '适应模式' : '填充模式';
    showNotification(`已切换到${modeText} 🖼️`);
}

// 更新显示模式
function updateDisplayMode() {
    slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => {
        slide.classList.remove('contain-mode', 'fill-mode');
        slide.classList.add(`${displayMode}-mode`);
    });
    
    // 更新按钮图标
    const btn = document.getElementById('display-mode-btn');
    if (btn) {
        btn.textContent = displayMode === 'contain' ? '🖼️' : '🔲';
        btn.title = displayMode === 'contain' ? '切换到填充模式' : '切换到适应模式';
    }
}
